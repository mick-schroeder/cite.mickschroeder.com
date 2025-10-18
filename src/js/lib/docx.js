import JSZip from "jszip";

const CRLF = "\r\n";
const BOUNDARY = "----=mhtDocumentPart";

const encodeQuotedPrintable = (input) => {
  const encoder = new TextEncoder();
  const lines = input.replace(/\r\n/g, "\n").split("\n");

  const wrapLine = (line) => {
    let wrapped = "";
    let current = "";

    for (let i = 0; i < line.length; ) {
      const segment =
        line[i] === "=" ? line.slice(i, i + 3) : line.slice(i, i + 1);
      i += segment.length;

      if (current.length + segment.length > 73) {
        wrapped += `${current}=${CRLF}`;
        current = segment;
      } else {
        current += segment;
      }
    }

    return wrapped + current;
  };

  return lines
    .map((line) => {
      const bytes = encoder.encode(line);
      let encoded = "";

      for (let index = 0; index < bytes.length; index++) {
        const byte = bytes[index];
        const isLast = index === bytes.length - 1;
        const isTextRange =
          (byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126);

        if (isTextRange || (!isLast && (byte === 32 || byte === 9))) {
          encoded += String.fromCharCode(byte);
        } else {
          encoded += `=${byte.toString(16).toUpperCase().padStart(2, "0")}`;
        }
      }

      return wrapLine(encoded);
    })
    .join(CRLF);
};

const createMhtDocument = (html) => {
  const encodedHtml = encodeQuotedPrintable(html);

  return [
    "MIME-Version: 1.0",
    "Content-Type: multipart/related;",
    '    type="text/html";',
    `    boundary="${BOUNDARY}"`,
    "",
    `--${BOUNDARY}`,
    'Content-Type: text/html; charset="utf-8"',
    "Content-Transfer-Encoding: quoted-printable",
    "Content-Location: file:///C:/fake/document.html",
    "",
    encodedHtml,
    `--${BOUNDARY}--`,
    "",
  ].join(CRLF);
};

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/afchunk.mht" ContentType="message/rfc822"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
`;

const ROOT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
`;

const DOCUMENT_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:altChunk r:id="htmlChunk"/>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
`;

const DOCUMENT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="htmlChunk" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk" Target="afchunk.mht"/>
</Relationships>
`;

const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>cite.mickschroeder.com</Application>
</Properties>
`;

const createCoreXml = (title, creator) => {
  const now = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${title}</dc:title>
  <dc:creator>${creator}</dc:creator>
  <cp:lastModifiedBy>${creator}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
  <cp:revision>1</cp:revision>
</cp:coreProperties>
`;
};

export const createDocxFromHtml = async (
  html,
  { title = "Citations", creator = "cite.mickschroeder.com" } = {},
) => {
  const zip = new JSZip();

  zip.file("[Content_Types].xml", CONTENT_TYPES_XML.trim());

  zip.folder("_rels").file(".rels", ROOT_RELS_XML.trim());

  const docProps = zip.folder("docProps");
  docProps.file("app.xml", APP_XML.trim());
  docProps.file("core.xml", createCoreXml(title, creator).trim());

  const word = zip.folder("word");
  word.file("document.xml", DOCUMENT_XML.trim());
  word.folder("_rels").file("document.xml.rels", DOCUMENT_RELS_XML.trim());
  word.file("afchunk.mht", createMhtDocument(html));

  return zip.generateAsync({ type: "blob" });
};
