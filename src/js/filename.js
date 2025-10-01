// Lightweight, browser-safe filename sanitizer to avoid bundling Node-only deps
// Removes invalid characters, trims spaces/dots, collapses whitespace, and limits length
const RESERVED_NAMES = new Set([
  "con",
  "prn",
  "aux",
  "nul",
  "com1",
  "com2",
  "com3",
  "com4",
  "com5",
  "com6",
  "com7",
  "com8",
  "com9",
  "lpt1",
  "lpt2",
  "lpt3",
  "lpt4",
  "lpt5",
  "lpt6",
  "lpt7",
  "lpt8",
  "lpt9",
]);

const filenamifySegment = (val, maxLen = 240) => {
  let value = (val ?? "").toString();
  // Replace path separators with dashes
  value = value.replace(/[\\/]+/g, "-");
  // Remove invalid characters for Windows/macOS
  value = value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "");
  // Normalize whitespace
  value = value.replace(/\s+/g, " ").trim();
  // Remove trailing dots/spaces (Windows)
  value = value.replace(/[ .]+$/g, "");
  // Avoid reserved device names (Windows)
  const lower = value.toLowerCase();
  if (RESERVED_NAMES.has(lower)) {
    value = `${value}-file`;
  }
  // Enforce a safe max length (leave headroom for extension)
  if (value.length > maxLen) {
    value = `${value.slice(0, maxLen - 1)}…`;
  }
  return value;
};

const extractYearFromItem = (item) => {
  if (!item || typeof item !== "object") {
    return "";
  }

  const fromDateLike = (value) => {
    const parsedYear = new Date(value).getFullYear();
    if (!Number.isNaN(parsedYear)) {
      return filenamifySegment(parsedYear.toString());
    }
    const match = `${value}`.match(/\d{4}/);
    if (match) {
      return filenamifySegment(match[0]);
    }
    return filenamifySegment(value);
  };

  if (item.date) {
    return fromDateLike(item.date);
  }

  const issued = item.issued;
  if (issued) {
    const normalizeParts = (parts) => {
      if (!Array.isArray(parts)) {
        return "";
      }
      const normalized = Array.isArray(parts[0]) ? parts[0] : parts;
      const year = normalized?.[0];
      if (year === undefined || year === null) {
        return "";
      }
      return filenamifySegment(year);
    };

    const partsValue =
      issued["date-parts"] || issued.dateParts || issued.dateparts;
    const fromParts = normalizeParts(partsValue);
    if (fromParts) {
      return fromParts;
    }

    if (Array.isArray(issued)) {
      const fromArray = normalizeParts(issued);
      if (fromArray) {
        return fromArray;
      }
    }

    const issuedRaw = issued.raw || issued.literal;
    if (issuedRaw) {
      return fromDateLike(issuedRaw);
    }

    if (typeof issued === "string") {
      return fromDateLike(issued);
    }
  }

  return "";
};

const getField = (item, key) =>
  (item && item[key] ? `${item[key]}` : "").trim();

const selectVenue = (item) => {
  const t = (item?.itemType || "").toString();
  const pick = (...keys) =>
    keys.map((k) => getField(item, k)).find(Boolean) || "";

  switch (t) {
    case "journalArticle":
    case "preprint":
      return pick("journalAbbreviation", "publicationTitle", "containerTitle");
    case "conferencePaper":
      return pick(
        "proceedingsTitle",
        "conferenceName",
        "publicationTitle",
        "containerTitle",
      );
    case "bookSection":
      return pick(
        "bookTitle",
        "seriesTitle",
        "publicationTitle",
        "containerTitle",
      );
    case "book":
      return pick("seriesTitle", "publisher");
    case "thesis":
      return pick("university", "publisher");
    case "report":
      return pick("institution", "publisher", "seriesTitle");
    case "webpage":
      return pick("websiteTitle", "publicationTitle");
    case "blogPost":
      return pick("blogTitle", "websiteTitle");
    case "forumPost":
      return pick("forumTitle", "websiteTitle");
    case "tvBroadcast":
    case "radioBroadcast":
    case "podcast":
      return pick("programTitle", "network");
    case "videoRecording":
      return pick("studio", "programTitle");
    case "audioRecording":
      return pick("label", "programTitle");
    case "dataset":
      return pick("repository", "archive");
    case "standard":
      return pick("organization");
    default:
      return pick(
        "journalAbbreviation",
        "containerTitle",
        "publicationTitle",
        "conferenceName",
        "institution",
        "publisher",
      );
  }
};

const buildCitationFilename = (item, fallbackPlainCitation = "") => {
  if (!item) {
    return "citation.pdf";
  }

  const sanitizedCitation = filenamifySegment(
    (fallbackPlainCitation || "").replace(/^\d+\.\s*/, "").trim(),
  );

  const creator = Array.isArray(item.creators) ? item.creators[0] : null;
  const lastName = filenamifySegment(
    creator?.lastName || creator?.family || creator?.name,
  );
  const firstName = filenamifySegment(creator?.firstName || creator?.given);

  const journalLike = filenamifySegment(selectVenue(item));
  const title = filenamifySegment(item.title);
  const yearString = extractYearFromItem(item);

  let filename = "";
  if (lastName && firstName && journalLike && yearString && title) {
    filename = filenamifySegment(
      `${lastName}, ${firstName} - ${journalLike} (${yearString}) ${title}`,
    );
  }

  if (!filename) {
    filename = sanitizedCitation || "citation";
  }

  // normalize spaces and ensure extension
  filename = (filename || "").replace(/\s+/g, " ").trim() || "citation";
  if (!filename.toLowerCase().endsWith(".pdf")) {
    filename = `${filename}.pdf`;
  }

  // final filenamify pass for safety
  filename = filenamifySegment(filename) || "citation.pdf";

  return filename;
};

export { buildCitationFilename, extractYearFromItem, filenamifySegment };

// Build an Unpaywall URL from an item or DOI string.
// Accepts DOI in forms like:
//  - 10.1234/abcd
//  - https://doi.org/10.1234/abcd
//  - doi:10.1234/abcd
// Returns "https://unpaywall.org/<DOI>" or null if no DOI present.
const normalizeDoi = (val) => {
  if (!val) return "";
  const raw = `${val}`.trim();
  const lowered = raw.toLowerCase();
  if (
    lowered.startsWith("http://doi.org/") ||
    lowered.startsWith("https://doi.org/")
  ) {
    return raw.replace(/^[a-z]+:\/\/doi\.org\//i, "");
  }
  if (lowered.startsWith("doi:")) {
    return raw.replace(/^doi:/i, "").trim();
  }
  return raw;
};

const buildUnpaywallUrl = (itemOrDoi) => {
  const doi = typeof itemOrDoi === "string" ? itemOrDoi : itemOrDoi?.DOI;
  const norm = normalizeDoi(doi);
  if (!norm) return null;
  return `https://unpaywall.org/${norm}`;
};

export { buildUnpaywallUrl };
