import { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from './ui/button';
import { Quote, Type, FileText, Pencil, Trash2, Palette, ClipboardCopy, Upload, Save, Link as LinkIcon, Globe, Microscope, Hash, Book, Code2, Puzzle, FileDown } from 'lucide-react';
import { citationStylesCount } from '../../../data/citation-styles-data.json';

const About2 = ({ onGetStartedClick }) => (
	<section className="section pt-12">
		<div className="container mx-auto max-w-screen-xl px-4 md:px-6">
			
			<h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-center">
				<FormattedMessage id="zbib.about.title" description="about-title" defaultMessage="Suggest citations from PubMed, journals, websites and books." />
			</h1>
			<p className="lead mx-auto mt-3 max-w-3xl text-lg text-muted-foreground text-center">
				<FormattedMessage
					id="zbib.about.summary"
					description="about-summary"
					defaultMessage="Generate accurate citations from PubMed (PMIDs), DOIs, ISBNs, and webpages in seconds. Export APA, MLA, Chicago, AMA, and 10,000+ CSL styles. Private by default—no account or install required."
					values={ { link: chunk => <a href="https://www.zotero.org/">{ chunk }</a> }} //eslint-disable-line react/display-name
				/>

			</p>
      <h2 className="scroll-m-20 border-b pb-2 pt-6 text-3xl font-semibold tracking-tight first:mt-0">
      About
    </h2>
    			<section className="features mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

<div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Quote className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Suggesting a Citation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Paste a URL in the text box and click <span className="font-medium">Suggest Citation</span>. Automatically pull in data from thousands of medical and scientific journals, newspapers, magazine articles, and library catalogs. You can also use an identifier such as an ISBN, DOI, PMID, or arXiv ID, or you can search by title.
        </p>
      </div>
<div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Palette className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">10,000+ Citation Styles</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Format your bibliography using AMA, APA, MLA, Chicago/Turabian, or any of the 10,000+ other <a className="underline underline-offset-4 hover:text-foreground" href="http://citationstyles.org/">Citation Style Language (CSL)</a> styles <a className="underline underline-offset-4 hover:text-foreground" href="https://github.com/citation-style-language/styles">maintained</a> by CSL project members. For more information, check out <a className="underline underline-offset-4 hover:text-foreground" href="http://citationstyles.org/" rel="nofollow">CitationStyles.org</a> and the <a className="underline underline-offset-4 hover:text-foreground" href="https://github.com/citation-style-language/styles/wiki">repository wiki</a>.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Save className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          <FormattedMessage id="zbib.about.autosave.header" description="autosave-header" defaultMessage="Autosave" />
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <FormattedMessage
            id="zbib.about.autosave.description"
            description="autosave-description"
            defaultMessage="Mick Schroeder's Citation Generator automatically saves your bibliography to
            your browser’s local storage — you can close the page and return to
            it anytime. (If you’re using private / incognito mode in your
            browser, your bibliography will be cleared when you close the
            window.)"
          />
        </p>
      </div>
  
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Code2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Open Source</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on <a className="underline underline-offset-4 hover:text-foreground" href="https://github.com/zotero/bib-web" rel="external">ZoteroBib</a>. This program is free software: you can redistribute it and/or modify it under the terms of the <a className="underline underline-offset-4 hover:text-foreground" href="https://www.gnu.org/licenses/agpl.html" rel="external">GNU Affero General Public License</a> as published by the <a className="underline underline-offset-4 hover:text-foreground" href="https://www.fsf.org/" rel="external">Free Software Foundation</a>.
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://github.com/mick-schroeder/schroeder-cite" rel="external">Project on GitHub</a></li>
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://github.com/zotero/bib-web" rel="external">ZoteroBib Project on GitHub</a></li>
        </ul>
      </div>
  
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Puzzle className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Browser Extensions</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Automatically load the current page in your browser.
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://chrome.google.com/webstore/detail/mick-schroeders-citation/gocmebnobccjiigdnakfmlieghedgdhk" rel="external">Google Chrome Web Store</a></li>
        </ul>
      </div>
    </section>
    <h2 className="scroll-m-20 border-b pb-2 pt-6 text-3xl font-semibold tracking-tight first:mt-0">
      Help
    </h2>
			<section className="features mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
         
     
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Type className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          <FormattedMessage id="zbib.about.manualEntry.header" description="manual-entry-header" defaultMessage="Manual entry" />
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <FormattedMessage
            id="zbib.about.manualEntry.description"
            description="manual-entry-description"
            defaultMessage="If automatic import doesn’t find your source or you’re adding something without a URL or identifier, you can enter the reference details manually."
          />
        </p>
      </div>
 
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Pencil className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          <FormattedMessage id="zbib.about.editingItem.header" description="editing-item-header" defaultMessage="Editing an item" />
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <FormattedMessage
            id="zbib.about.editingItem.description"
            description="editing-item-description"
            defaultMessage="After adding an item, you may need to update or add details. Click a bibliography entry to edit its fields manually."
          />
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Trash2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          <FormattedMessage id="zbib.about.deletingItems.header" description="deleting-items-header" defaultMessage="Deleting items" />
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <FormattedMessage
            id="zbib.about.deletingItems.description"
            description="deleting-items-description"
            defaultMessage="Click the { deleteIcon } next to an entry to delete it. To start a new bibliography, select <i>Delete Bibliography</i> to remove all entries."
            values={ {
              deleteIcon: <Trash2 className="inline h-4 w-4 align-text-bottom" aria-hidden="true" />,
              i: chunk => <i>{ chunk }</i>  //eslint-disable-line react/display-name
            } }
          />
        </p>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <ClipboardCopy className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">
          <FormattedMessage id="zbib.about.copyCitation.header" description="copy-citation-header" defaultMessage="Copy Citation / Note" />
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <FormattedMessage
            id="zbib.about.copyCitation.description"
            description="copy-citation-description"
            defaultMessage="While writing, quickly create parenthetical citations or footnotes/endnotes to paste into your document—no need to type names or dates manually."
          />
        </p>
      </div>

     <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Quote className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Copy In-Text Citation and Notes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Click the “Copy Note” icon for in-text citations and endnotes/footnotes.
        </p>
      </div>
  
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <FileDown className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Export Bibliography</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Export your bibliography into many formats. Copy a formatted bibliography to your clipboard, export HTML (for websites) or download .RTF (for word processors), .RIS, .BibTeX, or save to Zotero.
        </p>
      </div>
  
      
  </section>
  <h2 className="scroll-m-20 border-b pb-2 pt-6 text-3xl font-semibold tracking-tight first:mt-0">
      Examples
    </h2>
			<section className="features mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
<div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Globe className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Example: Website URLs</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a website address (URL):
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.nejm.org%2Fdoi%2Ffull%2F10.1056%2FNEJMoa1403108">https://nejm.org/…</a></li>
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.nytimes.com%2F2013%2F03%2F05%2Fscience%2Fchasing-the-higgs-boson-how-2-teams-of-rivals-at-CERN-searched-for-physics-most-elusive-particle.html">https://nytimes.com/…</a></li>
        </ul>
      </div>
  
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Microscope className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Example: PubMed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a PMID (PubMed ID) or URL:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=30280635">30280635</a></li>
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fpubmed.ncbi.nlm.nih.gov%2F30280635%2F">https://pubmed.ncbi.nlm.nih.gov/…</a></li>
        </ul>
      </div>
  
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Hash className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Example: DOI</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Provide a persistent “address” to many types of work, from journal articles to research data sets:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=10.1126%2Fscience.169.3946.635">10.1126/science.169.3946.635</a></li>
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fdoi.org%2F10.1038/nature21360">https://doi.org/…</a></li>
        </ul>
      </div>
  
      <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition">
        <div className="mb-4 inline-flex items-center justify-center rounded-md bg-muted p-2">
          <Book className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Example: ISBN</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          International Standard Book Number is a unique numeric book identifier:
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=0323040683">0323040683</a></li>
          <li><a className="underline underline-offset-4 hover:text-foreground break-all" href="https://cite.mickschroeder.com/?q=https%3A%2F%2Fwww.amazon.com%2Fs%3Fk%3D0702052302">https://amazon.com/…</a></li>
        </ul>
      </div>

    </section>
			<div className="my-10 flex justify-center">
				<Button onClick={ onGetStartedClick } size="lg" className="px-6">
					<FormattedMessage id="zbib.about.CTA" description="cta-button" defaultMessage="Start citing" />
				</Button>
			</div>
		</div>
	</section>
);

About2.propTypes = {
	onGetStartedClick: PropTypes.func.isRequired,
}

export default memo(About2);
