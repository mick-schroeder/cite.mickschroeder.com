import { memo } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import { Button as ShadcnButton } from "./ui/button";
import {
  Quote,
  Type,
  FileText,
  Pencil,
  Trash2,
  Palette,
  ClipboardCopy,
  Upload,
  Save,
  Link as LinkIcon,
  Globe,
  Microscope,
  Hash,
  Book,
  Code2,
  Puzzle,
  FileDown,
  Info,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { citationStylesCount } from "../../../data/citation-styles-data.json";

const About2 = ({ onGetStartedClick }) => (
  <section className="section">
    <div className="">
      <h2 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-center">
        <FormattedMessage
          id="zbib.about.title"
          description="about-title"
          defaultMessage="Suggest citations from PubMed, journals, websites and books."
        />
      </h2>
      <p className="lead mx-auto mt-3 max-w-3xl text-lg text-muted-foreground text-center">
        <FormattedMessage
          id="zbib.about.summary"
          description="about-summary"
          defaultMessage="Generate accurate citations from PubMed (PMIDs), DOIs, ISBNs, and webpages in seconds. Export APA, MLA, Chicago, AMA, and 10,000+ CSL styles. Private by default—no account or install required."
          values={{
            link: (chunk) => <a href="https://www.zotero.org/">{chunk}</a>,
          }} //eslint-disable-line react/display-name
        />
      </p>
      <h3
        id="about"
        className="scroll-m-20 border-b pb-2 pt-6 text-3xl font-semibold tracking-tight first:mt-0"
      >
        <Info
          className="inline h-6 w-6 text-primary -mt-1 mr-2"
          aria-hidden="true"
        />
        <FormattedMessage
          id="zbib.about.section.about"
          description="about-section-title"
          defaultMessage="About"
        />
      </h3>
      <section className="features mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.suggest.header"
              description="suggesting-citation-header"
              defaultMessage="Suggesting a citation"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.suggest.description"
              description="suggesting-citation-description"
              defaultMessage="Paste a URL or identifier and select {action}. We’ll retrieve metadata from scholarly journals, news outlets, library catalogs, and more. You can also enter an ISBN, DOI, PMID, or arXiv ID, or search by title."
              values={{
                action: (
                  <span className="font-medium">
                    <FormattedMessage
                      id="zbib.about.suggest.action"
                      description="suggesting-citation-action"
                      defaultMessage="Suggest Citation"
                    />
                  </span>
                ),
              }}
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Palette className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.styles.header"
              description="citation-styles-header"
              defaultMessage="10,000+ citation styles"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.styles.description"
              description="citation-styles-description"
              defaultMessage="Format your bibliography using AMA, APA, MLA, Chicago/Turabian, or any of the 10,000+ other {csl} styles {maintained} by CSL project members. For more information, check out {site} and the {wiki}."
              values={{
                csl: (
                  <a
                    className="underline underline-offset-4 hover:text-foreground"
                    href="http://citationstyles.org/"
                  >
                    Citation Style Language (CSL)
                  </a>
                ),
                maintained: (
                  <a
                    className="underline underline-offset-4 hover:text-foreground"
                    href="https://github.com/citation-style-language/styles"
                  >
                    maintained
                  </a>
                ),
                site: (
                  <a
                    className="underline underline-offset-4 hover:text-foreground"
                    href="http://citationstyles.org/"
                    rel="nofollow"
                  >
                    CitationStyles.org
                  </a>
                ),
                wiki: (
                  <a
                    className="underline underline-offset-4 hover:text-foreground"
                    href="https://github.com/citation-style-language/styles/wiki"
                  >
                    repository wiki
                  </a>
                ),
              }}
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Save className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.autosave.header"
              description="autosave-header"
              defaultMessage="Autosave"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.autosave.description"
              description="autosave-description"
              defaultMessage="Your bibliography is stored in your browser, so you can close the page and return later. 
              Note: in private or incognito windows, the data is erased when the window closes."
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Code2 className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">Open Source</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Based on{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="https://github.com/zotero/bib-web"
              rel="external"
            >
              ZoteroBib
            </a>
            . This program is free software: you can redistribute it and/or
            modify it under the terms of the{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="https://www.gnu.org/licenses/agpl.html"
              rel="external"
            >
              GNU Affero General Public License
            </a>{" "}
            as published by the{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="https://www.fsf.org/"
              rel="external"
            >
              Free Software Foundation
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ShadcnButton
              asChild
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <a
                href="https://github.com/mick-schroeder/schroeder-cite"
                rel="external"
              >
                <FormattedMessage
                  id="zbib.about.opensource.projectLink"
                  description="open-source-project-link"
                  defaultMessage="Project on GitHub"
                />
              </a>
            </ShadcnButton>
            <ShadcnButton
              asChild
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <a href="https://github.com/zotero/bib-web" rel="external">
                <FormattedMessage
                  id="zbib.about.opensource.zbibLink"
                  description="open-source-zotero-project-link"
                  defaultMessage="ZoteroBib Project on GitHub"
                />
              </a>
            </ShadcnButton>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Puzzle className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            Browser Extensions
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Automatically load the current page in your browser.
          </p>
          <div className="mt-4">
            <ShadcnButton
              asChild
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <a
                href="https://chrome.google.com/webstore/detail/mick-schroeders-citation/gocmebnobccjiigdnakfmlieghedgdhk"
                rel="external"
              >
                <FormattedMessage
                  id="zbib.about.browser.chromeWebStore"
                  description="browser-extensions-chrome-web-store"
                  defaultMessage="Google Chrome Web Store"
                />
              </a>
            </ShadcnButton>
          </div>
        </div>
      </section>
      <h3
        id="help"
        className="scroll-m-20 border-b pb-2 pt-6 text-3xl font-semibold tracking-tight first:mt-0"
      >
        <HelpCircle
          className="inline h-6 w-6 text-primary -mt-1 mr-2"
          aria-hidden="true"
        />
        <FormattedMessage
          id="zbib.about.section.help"
          description="help-section-title"
          defaultMessage="Help"
        />
      </h3>
      <section className="features mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Type className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.manualEntry.header"
              description="manual-entry-header"
              defaultMessage="Manual entry"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.manualEntry.description"
              description="manual-entry-description"
              defaultMessage="If automatic import doesn’t find your source or you’re adding something without a URL or identifier, you can enter the reference details manually."
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Pencil className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.editingItem.header"
              description="editing-item-header"
              defaultMessage="Editing an item"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.editingItem.description"
              description="editing-item-description"
              defaultMessage="After adding an item, you may need to update or add details. Click a bibliography entry to edit its fields manually."
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Trash2 className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.deletingItems.header"
              description="deleting-items-header"
              defaultMessage="Deleting items"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.deletingItems.description"
              description="deleting-items-description"
              defaultMessage="Click the { deleteIcon } next to an entry to delete it. To start a new bibliography, select <i>Delete Bibliography</i> to remove all entries."
              values={{
                deleteIcon: (
                  <Trash2
                    className="inline h-4 w-4 align-text-bottom text-primary"
                    aria-hidden="true"
                  />
                ),
                i: (chunk) => <i>{chunk}</i>, //eslint-disable-line react/display-name
              }}
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <ClipboardCopy
              className="h-8 w-8 text-primary"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <FormattedMessage
              id="zbib.about.copyCitation.header"
              description="copy-citation-header"
              defaultMessage="Copy Citation / Note"
            />
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            <FormattedMessage
              id="zbib.about.copyCitation.description"
              description="copy-citation-description"
              defaultMessage="While writing, quickly create parenthetical citations or footnotes/endnotes to paste into your document—no need to type names or dates manually."
            />
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            Copy In-Text Citation and Notes
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the “Copy Note” icon for in-text citations and
            endnotes/footnotes.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow transition motion-reduce:transition-none">
          <div className="mb-4 inline-flex items-center justify-center rounded-md bg-background p-2">
            <FileDown className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            Export Bibliography
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Export your bibliography into many formats. Copy a formatted
            bibliography to your clipboard, export HTML (for websites) or
            download .RTF (for word processors), .RIS, .BibTeX.
          </p>
        </div>
      </section>
      <div className="my-10 flex justify-center">
        <ShadcnButton
          onClick={onGetStartedClick}
          size="lg"
          className="px-6 w-full sm:w-auto"
        >
          <FormattedMessage
            id="zbib.about.CTA"
            description="cta-button"
            defaultMessage="Return to the Top and Start Citing"
          />
        </ShadcnButton>
      </div>
    </div>
  </section>
);

About2.propTypes = {
  onGetStartedClick: PropTypes.func.isRequired,
};

export default memo(About2);
