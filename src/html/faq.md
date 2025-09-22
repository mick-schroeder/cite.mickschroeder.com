# Mick Schroeder's Citation Generator

## Frequently Asked Questions (FAQ)

<nav>
  <ul>
  	<li><a href="#general">General</a></li>
  	<li><a href="#usage">Getting Started</a></li>
  	<li><a href="#troubleshooting">Fixing Problems</a></li>
  </ul>
</nav>

## General

### What is Mick Schroeder's Citation Generator?

This is a free, open-source tool that helps you create bibliographies quickly on any device. You don’t need an account or any special software — everything runs in your browser. It builds on the same open research infrastructure that powers Zotero, ensuring accurate data and wide support for academic sources.

### How much does it cost?

Nothing at all. The generator is completely free and open-source software.

### How are my queries handled?

Queries are resolved through [Zotero Translators](https://github.com/zotero/translators), an open-source community project that extracts citation metadata from thousands of sources.

### What citation styles are available?

The generator supports over 9,000 [Citation Style Language (CSL)](http://citationstyles.org/) styles, including AMA, APA, MLA, NLM, Chicago/Turabian, and Vancouver.  
You can preview styles in the [Zotero Style Repository](https://www.zotero.org/styles) or the [CSL visual editor](http://editor.citationstyles.org/searchByExample/).

Styles are maintained in the [official CSL repository](https://github.com/citation-style-language/styles), released under the [CC BY-SA 3.0 license](http://creativecommons.org/licenses/by-sa/3.0/).

### Where is my bibliography stored?

Your bibliography is kept locally in your browser’s storage. That means if you close the page and return later, your entries will still be there.

If you use private/incognito mode, the data is cleared as soon as you close the window. Some browsers or cleaning tools may also wipe this storage.

### How long does it stay there?

The data remains until you delete it or clear your browser cache. Some browsers (e.g., Safari/iOS) automatically clear local storage for inactive sites after a set period, so keep that in mind if you need long-term persistence.

<h3 id="privacy">Is my data private?</h3>

Yes. Your bibliography is stored on your own computer and isn’t shared with others by default.

When you run a search, the request is sent to our server to fetch results. We temporarily log IP, browser version, and query terms only to maintain the service and protect against abuse. These logs are short-term and not used for profiling or advertising.

---

## Getting Started

### How do I add items to my bibliography?

- **Paste a URL**: Copy the page link from your browser (articles, catalogs, books, etc.). The system will try to fetch metadata automatically.
- **Use identifiers**: Add an ISBN, DOI, PubMed ID (PMID), or arXiv ID for precise matches.
- **Search by title**: Enter a title (plus author/year if you like) and select the correct version.
- **Manual entry**: If all else fails, you can type details directly by choosing _Manual Entry_.

### How do I add in-text citations or notes?

Next to each bibliography entry, you can generate:

- Parenthetical citations (e.g., APA, MLA).
- Notes/footnotes (e.g., Chicago, Turabian).

You can also add page numbers or ranges. If you’ve already named the author in your text, use the “omit author” option so only the date or pages appear in the parentheses.

### How do I add a finished bibliography to a paper?

- **Copy to Clipboard**: Paste the bibliography directly into your word processor.
- **Download RTF**: Useful if your processor scrambles clipboard formatting.
- **Copy HTML**: For embedding on websites.

### Can I export to a reference manager?

Yes.

- **Download RIS or BibTeX** to import into most reference managers.
- If you use Zotero with the Connector, you can also save items directly to your Zotero library from your browser.

<h3 id="site_integration">Can I integrate this with my own site?</h3>

Yes. Link to `/import?q=[url]`, where `url` points to a BibTeX, RIS, or other supported file. Visitors can then pull that citation data into their bibliography.

---

## Fixing Problems

### I tried adding an item and got an error. What now?

Some sites block metadata extraction or format content in ways that don’t work with translators. If a URL fails, try an ISBN, DOI, PMID, or arXiv ID instead. Manual entry is always an option.

### The metadata looks wrong or incomplete. How can I fix it?

Always double-check imported data. Sometimes you’ll need to adjust or add missing fields manually.  
If a particular source routinely fails, check the [zotero/translators](https://github.com/zotero/translators) repository to see if there’s an open issue — or contribute a fix if you can.

<h3 id="sentence-case">Why are some words lowercased in titles when I use certain styles?</h3>

Some styles (like APA) require sentence case. The generator automatically converts titles, but you may need to fix proper nouns.

Example:

- **Title case:** _Deep Learning Approaches to MRI Reconstruction_
- **Converted:** _Deep learning approaches to mri reconstruction_
- **Corrected:** _Deep learning approaches to **M**RI reconstruction_

### What if I can’t find the style I need?

Browse the [Zotero Style Repository](https://www.zotero.org/styles) or use the [CSL visual editor](http://editor.citationstyles.org/searchByExample/). If it’s still missing, you can [request a new style](https://github.com/citation-style-language/styles/wiki/Requesting-Styles).

### My bibliography doesn’t match the style exactly.

Styles evolve, and sometimes teachers or publishers have specific requirements. Double-check your data and style guide. If needed, make manual corrections before submission. Report issues or request updates in the [CSL GitHub repository](https://github.com/citation-style-language/styles).

<h3 id="help">Something else isn’t working. Where can I get help?</h3>

Please open an issue in the [GitHub repository](https://github.com/mick-schroeder/cite.mickschroeder.com). If you have coding skills, you’re welcome to suggest or contribute fixes.
