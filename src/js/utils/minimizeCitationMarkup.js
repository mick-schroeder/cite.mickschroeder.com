// Produces minimal markup for citations: strips CSL layout, numbering, and inline styles,
// keeps only emphasis tags, and provides plain/RTF/html variants that inherit host styles.
const minimizeCitationMarkup = (html) => {
  if (!html || typeof document === "undefined") {
    return { html: html || "", text: "" };
  }

  const container = document.createElement("div");
  container.innerHTML = html;

  const unwrap = (node) => {
    const parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) {
      parent.insertBefore(node.firstChild, node);
    }
    parent.removeChild(node);
  };

  container.querySelectorAll(".csl-left-margin").forEach((node) => {
    node.remove();
  });
  [".csl-right-inline", ".csl-entry", ".csl-bib-body", "ol", "li"].forEach(
    (selector) => {
      Array.from(container.querySelectorAll(selector)).forEach(unwrap);
    },
  );
  container.querySelectorAll("[style]").forEach((node) => {
    node.removeAttribute("style");
  });
  container.querySelectorAll("[class]").forEach((node) => {
    const className =
      typeof node.className === "string"
        ? node.className
        : node.className?.baseVal || "";
    if (className.startsWith("csl-")) {
      node.removeAttribute("class");
    }
  });

  const allowedTags = new Set(["em", "i", "strong", "b", "sup", "sub"]);
  Array.from(container.querySelectorAll("*")).forEach((node) => {
    Array.from(node.attributes).forEach((attr) =>
      node.removeAttribute(attr.name),
    );
    if (!allowedTags.has(node.tagName.toLowerCase())) {
      unwrap(node);
    }
  });

  const stripLeadingNumber = () => {
    const numberPattern = /^\s*[\[\(]?\d+[\]\)]?[.,]?\s*/;
    let node = container.firstChild;

    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const replaced = node.textContent.replace(numberPattern, "");
        if (replaced.length !== node.textContent.length) {
          if (replaced.trim().length === 0) {
            const next = node.nextSibling;
            node.remove();
            node = next;
            continue;
          }
          node.textContent = replaced;
        }
        break;
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.textContent &&
        numberPattern.test(node.textContent)
      ) {
        if (node.textContent.replace(numberPattern, "").trim().length === 0) {
          const next = node.nextSibling;
          node.remove();
          node = next;
          continue;
        } else if (node.childNodes.length === 1) {
          node.textContent = node.textContent.replace(numberPattern, "");
        }
        break;
      }
      node = node.nextSibling;
    }
  };

  stripLeadingNumber();

  const cleanHtml = container.innerHTML.trim();
  const cleanText = (container.textContent || "")
    .replace(/^\s*[\[\(]?\d+[\]\)]?[.,]?\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  const escapeRtf = (val) =>
    val.replace(/[\\{}]/g, (m) => `\\${m}`).replace(/\n/g, "\\line ");

  const nodeToRtf = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeRtf(node.nodeValue || "");
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      const children = Array.from(node.childNodes)
        .map((child) => nodeToRtf(child))
        .join("");
      switch (tag) {
        case "i":
        case "em":
          return `\\i ${children}\\i0 `;
        case "b":
        case "strong":
          return `\\b ${children}\\b0 `;
        case "sup":
          return `\\super ${children}\\nosupersub `;
        case "sub":
          return `\\sub ${children}\\nosupersub `;
        default:
          return children;
      }
    }
    return "";
  };

  const rtfBody = Array.from(container.childNodes)
    .map((child) => nodeToRtf(child))
    .join("")
    .trim();
  const rtf =
    rtfBody &&
    `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0\\fnil\\fcharset0;}}\\viewkind4\\uc1\\pard\\f0\\fs24 ${rtfBody}\\par}`;

  return {
    html: cleanHtml
      ? `<!--StartFragment--><span style="font-family: ; font-size: ; font-weight: ; font-style: ;">${cleanHtml}</span><!--EndFragment-->`
      : "",
    text: cleanText,
    rtf: rtf || "",
  };
};

export { minimizeCitationMarkup };
