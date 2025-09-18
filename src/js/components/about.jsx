import { memo } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import { Button as ShadcnButton } from "./ui/button";
import { citationStylesCount } from "../../../data/citation-styles-data.json";

const About = ({ onGetStartedClick }) => (
  <section className="section section-about about">
    <div className="container">
      <img
        src="/static/images/about/citeproc.svg"
        className="zbib-illustration"
        width="312"
        height="400"
        alt="ZoteroBib"
      />
      <h1>
        <FormattedMessage
          id="zbib.about.title"
          defaultMessage="Cite anything"
        />
      </h1>
      <p className="lead">
        <FormattedMessage
          id="zbib.about.summary"
          defaultMessage="ZoteroBib helps you build a bibliography instantly from any
					computer or device, without creating an account or installing any software. It’s
					brought to you by the team behind <link>Zotero</link>, the powerful open-source
					research tool recommended by thousands of universities worldwide, so you can
					trust it to help you seamlessly add sources and produce perfect bibliographies.
					If you need to reuse sources across multiple projects or build a shared research
					library, we recommend using Zotero instead."
          values={{
            link: (chunk) => <a href="https://www.zotero.org/">{chunk}</a>,
          }} //eslint-disable-line react/display-name
        />
      </p>
      <section className="features">
        <div className="column">
          <section className="feature">
            <img
              src="/static/images/about/cite.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.addingEntry.header"
                defaultMessage="Adding a bibliography entry"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.addingEntry.description"
                defaultMessage="Simply find what you’re looking for in another
								browser tab and copy the page URL to the ZoteroBib search bar.
								ZoteroBib can automatically pull in data from newspaper and magazine
								articles, library catalogs, journal articles, sites like Amazon and
								Google Books, and much more. You can also paste or type in an ISBN,
								DOI, PMID, or arXiv ID, or you can search by title."
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/manual-entry.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.manualEntry.header"
                defaultMessage="Manual entry"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.manualEntry.description"
                defaultMessage="If automatic import doesn’t find what you’re looking
								for or you’re entering something without a URL or identifier, you
								can enter the reference information by hand."
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/bibliography-title.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.settingTitle.header"
                defaultMessage="Bibliography title"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.settingTitle.description"
                defaultMessage="To rename your bibliography, just click its title. A
								title can be useful if you’re switching between multiple projects or
								sharing a bibliography with others."
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/editing.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.editingItem.header"
                defaultMessage="Editing an item"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.editingItem.description"
                defaultMessage="You might need to add or change a few fields after adding an
								item. Click on a bibliography entry to make manual changes."
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/deleting-items.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.deletingItems.header"
                defaultMessage="Deleting items"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.deletingItems.description"
                defaultMessage="Click the { deleteIcon } next to a bibliography entry to delete it. To start a new
								bibliography, click <i>Delete Bibliography</i> to remove all entries."
                values={{
                  deleteIcon: (
                    <img
                      src="/static/images/about/remove-xs.svg"
                      className="remove-icon"
                      width="14"
                      height="14"
                      alt="Remove icon"
                    />
                  ),
                  i: (chunk) => <i>{chunk}</i>, //eslint-disable-line react/display-name
                }}
              />
            </p>
          </section>
        </div>
        <div className="column">
          <section className="feature">
            <img
              src="/static/images/about/style-selection.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.styleSelection.header"
                defaultMessage="Style selection"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.styleSelection.description"
                defaultMessage="Format your bibliography using APA, MLA, Chicago / Turabian,
									Harvard, or any of the {citationStylesCount, plural, other {#+ other <link>CSL</link> styles} }."
                values={{
                  citationStylesCount:
                    Math.floor(citationStylesCount / 1000) * 1000,
                  link: (chunk) => (
                    <a href="https://citationstyles.org/">{chunk}</a>
                  ), //eslint-disable-line react/display-name
                }}
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/copy.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.copyCitation.header"
                defaultMessage="Copy Citation / Note"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.copyCitation.description"
                defaultMessage="As you’re writing, you can quickly generate
								parenthetical citations or footnotes /endnotes to paste into your
								document without typing names or dates by hand."
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/export.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.export.header"
                defaultMessage="Export"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.export.description"
                defaultMessage="When you’re done, you can copy a formatted
								bibliography to the clipboard and paste it into your document. You
								can also export HTML to add to a webpage, an RTF document to open in
								a word processor, or a RIS or BibTeX file to import into a reference
								manager."
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/autosave.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.autosave.header"
                defaultMessage="Autosave"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.autosave.description"
                defaultMessage="ZoteroBib automatically saves your bibliography to
								your browser’s local storage — you can close the page and return to
								it anytime. (If you’re using private / incognito mode in your
								browser, your bibliography will be cleared when you close the
								window.)"
              />
            </p>
          </section>
          <section className="feature">
            <img
              src="/static/images/about/link.svg"
              className="feature-icon"
              width="66"
              height="66"
              alt=""
            />
            <h2 className="h4">
              <FormattedMessage
                id="zbib.about.linkToVersion.header"
                defaultMessage="Link to this version"
              />
            </h2>
            <p>
              <FormattedMessage
                id="zbib.about.linkToVersion.description"
                defaultMessage="If you want to edit your bibliography on another
								device, share it with someone else, or switch to another
								bibliography, you can generate a link to a copy of the current
								version on zbib.org. Use the link to retrieve your bibliography
								later."
              />
            </p>
          </section>
        </div>
      </section>
      <ShadcnButton
        onClick={onGetStartedClick}
        size="lg"
        variant="outline"
        className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
      >
        <FormattedMessage
          id="zbib.about.CTA"
          defaultMessage="Awesome! Let’s start!"
        />
      </ShadcnButton>
      <p className="support">
        <FormattedMessage
          id="zbib.about.questionsFaq"
          defaultMessage="<block>Still have questions?</block> Check the <link>FAQ</link>."
          values={{
            block: (chunk) => (
              <span className="d-xs-block d-sm-inline">{chunk}</span>
            ), //eslint-disable-line react/display-name
            link: (chunk) => <a href="/faq">{chunk}</a>, //eslint-disable-line react/display-name
          }}
        />
      </p>
    </div>
  </section>
);

About.propTypes = {
  onGetStartedClick: PropTypes.func.isRequired,
};

export default memo(About);
