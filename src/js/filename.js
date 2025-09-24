import filenamify from "filenamify";

const filenamifySegment = (value) => filenamify((value ?? "").toString()).trim();

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

    const partsValue = issued["date-parts"] || issued.dateParts || issued.dateparts;
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

const getField = (item, key) => (item && item[key] ? `${item[key]}` : "").trim();

const selectVenue = (item) => {
  const t = (item?.itemType || "").toString();
  const pick = (...keys) => keys.map((k) => getField(item, k)).find(Boolean) || "";

  switch (t) {
    case "journalArticle":
    case "preprint":
      return pick("journalAbbreviation", "publicationTitle", "containerTitle");
    case "conferencePaper":
      return pick("proceedingsTitle", "conferenceName", "publicationTitle", "containerTitle");
    case "bookSection":
      return pick("bookTitle", "seriesTitle", "publicationTitle", "containerTitle");
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
  const lastName = filenamifySegment(creator?.lastName || creator?.family || creator?.name);
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
