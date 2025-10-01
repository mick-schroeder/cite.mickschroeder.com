import { Fragment, memo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useIntl, FormattedMessage } from "react-intl";
import { Button as ShadcnButton } from "./ui/button";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { pick } from "web-common/utils";
import { useFocusManager } from "web-common/hooks";
import About2 from "./about2";
import Examples from "./examples";
import BibliographySection from "./bibliographySection";
import CiteTools from "./cite-tools";
import ConfirmAddDialog from "./confirm-add-dialog";
import Confirmation from "./confirmation";
import CopyCitationDialog from "./copy-citation-dialog";
import Editor from "./editor";
import Footer from "./footer";
import Navigation from "./navigation";
import Message from "./message";
import Modal from "./modal";
import MultipleChoiceDialog from "./multiple-choice-dialog";
import MultipleItemDialog from "./multiple-items-dialog";
import PermalinkTools from "./permalink-tools";
import Review from "./review";
import StyleInstaller from "./style-installer";
import WhatsThis from "./whats-this";

const commonFormats = {
  b: (chunks) => <b>{chunks}</b>, //eslint-disable-line react/display-name
  i: (chunks) => <i>{chunks}</i>, //eslint-disable-line react/display-name
};

const titleCaseExample = "Circadian Mood Variations in Twitter Content";
const conversionExample = "Circadian mood variations in twitter content";
const sentenceCaseExample = (
  <Fragment>
    Circadian mood variations in{" "}
    <span style={{ color: "#e52e3d", fontWeight: "bold" }}>T</span>witter
    content
  </Fragment>
);

const ZBib = (props) => {
  const intl = useIntl();
  const saveToZotero = intl.formatMessage({
    id: "zbib.saveToZotero.title",
    defaultMessage: "Export to Zotero",
  });
  const navLabel = intl.formatMessage({
    id: "zbib.navLabel",
    defaultMessage: "Site Navigation",
  });
  const navRef = useRef(null);
  const { focusNext, focusPrev, receiveFocus, receiveBlur } =
    useFocusManager(navRef);

  const handleKeyDown = useCallback(
    (ev) => {
      if (ev.key === "ArrowRight") {
        focusNext(ev, { useCurrentTarget: false });
      } else if (ev.key === "ArrowLeft") {
        focusPrev(ev, { useCurrentTarget: false });
      }
    },
    [focusNext, focusPrev],
  );

  const className = {
    "zotero-bib-container": true,
    "read-only": props.isReadOnly,
    write: !props.isReadOnly,
    welcome: props.messages.some((m) => m.kind === "WELCOME_MESSAGE"),
  };

  return (
    <div
      className={cx(
        className,
        "w-full min-h-screen bg-background overflow-x-hidden",
      )}
    >
      <div className="zotero-bib-inner">
        <header className="w-full border-b mb-6">
          <Navigation
            onAboutClick={props.onAboutClick}
            onHelpClick={props.onHelpClick}
            onExamplesClick={props.onExamplesClick}
            onBibliographyClick={props.onBibliographyClick}
            onAddCitationClick={props.onAddCitationClick}
          />
        </header>

        <div className="container mx-auto lg:max-w-screen-lg lg:px-8 space-y-12 pt-6">
          {props.messages.map((message) => (
            <Message
              {...message}
              {...pick(props, [
                "onDismiss",
                "onUndoDelete",
                "onReadMore",
                "onShowDuplicate",
              ])}
              key={message.id}
            />
          ))}

          <section className="mx-auto max-w-3xl text-center space-y-4">
            <Badge
              variant="secondary"
              className="rounded-full py-1.5 px-4 border mb-2"
              asChild
            >
              <a href="/" className="flex items-center gap-2">
                <img
                  src="/static/images/icon-cite-round.svg"
                  className="h-6 w-6 shrink-0"
                  alt=""
                  aria-hidden="true"
                />
                <span className="text-sm font-medium self-center whitespace-nowrap text-muted-foreground">
                  <FormattedMessage
                    id="zbib.brand"
                    defaultMessage="Mick Schroeder's Citation Generator"
                  />
                </span>
              </a>
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight md:leading-tight [text-wrap:balance]">
              <FormattedMessage
                id="zbib.brand.title"
                defaultMessage="Generate free citations and tidy PDF filenames."
              />
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-prose mx-auto">
              <FormattedMessage
                id="zbib.brand.description"
                defaultMessage="Paste a URL, DOI, PMID, or ISBN. Choose from 10,000+ styles (AMA, APA, MLA, Chicago). Copy a citation or build a full bibliography. We also check Unpaywall for legal open-access PDFs and create a nice PDF filename."
              />
            </p>
          </section>

          {!props.isReadOnly && (
            <CiteTools
              {...pick(props, [
                "isTranslating",
                "onEditorOpen",
                "onTranslationCancel",
                "onTranslationRequest",
                "identifier",
                "citationStyle",
                "citationStyles",
                "onCitationStyleChanged",
              ])}
            />
          )}

          {!props.isReadOnly &&
            (props.isTranslating || props.itemUnderReview) && (
              <Review
                {...pick(props, [
                  "isTranslating",
                  "itemUnderReview",
                  "onReviewEdit",
                  "onReviewDelete",
                  "onReviewDismiss",
                  "styleHasBibliography",
                ])}
              />
            )}

          <Examples />

          <BibliographySection
            {...pick(props, [
              "bibliography",
              "bibliographyRendered",
              "bibliographyRenderedNodes",
              "citationStyle",
              "citationStyles",
              "copySingleState",
              "getCopyData",
              "hydrateItemsCount",
              "isHydrated",
              "isNoteStyle",
              "isNumericStyle",
              "isPrintMode",
              "isReadOnly",
              "isReady",
              "isSortedStyle",
              "localCitationsCount",
              "onCancelPrintMode",
              "onCitationCopyDialogOpen",
              "onCitationStyleChanged",
              "onCopySingle",
              "onDeleteCitations",
              "onDeleteEntry",
              "onDownloadFile",
              "onEditorOpen",
              "onOverride",
              "onReorderCitations",
              "onSaveToZoteroShow",
              "onTitleChanged",
              "styleHasBibliography",
              "title",
            ])}
          />

          {!props.isReadOnly && (
            <About2 onGetStartedClick={props.onGetStartedClick} />
          )}
        </div>
        <Footer {...pick(props, ["isReadOnly"])} />
      </div>
      {/*
					!props.isReadOnly && (
						<section
							aria-labelledby="link-to-this-version"
							className="section section-link space-y-4">
							<div className="">
								<div className="header-wrapper">
									<h2 id="link-to-this-version" className="scroll-m-20 text-2xl font-semibold tracking-tight">
										<FormattedMessage id="zbib.linkToThis" defaultMessage="Link to this version" />
									</h2>
									<WhatsThis />
								</div>
								<PermalinkTools { ...pick(props, ['bibliography', 'isSafari', 'onSave', 'permalink']) } />
							</div>
						</section>
					)
				*/}
      {/*
					props.isReadOnly && (
						<section className="section section-brand">
							<div className="">
								<Brand />
							</div>
						</section>
					)
				*/}

      {(!props.isHydrated || (props.isHydrated && props.isReady)) && (
        <Fragment>
          <Confirmation
            isOpen={props.activeDialog === "CONFIRM_SENTENCE_CASE_STYLE"}
            onConfirm={props.onStyleSwitchConfirm}
            onCancel={props.onStyleSwitchCancel}
            title={intl.formatMessage({
              id: "zbib.confirmCase.title",
              defaultMessage: "Convert titles to sentence case",
            })}
            confirmLabel={intl.formatMessage({
              id: "zbib.confirmCase.confirm",
              defaultMessage: "OK, I’ll review titles",
            })}
          >
            <p>
              <FormattedMessage
                id="zbib.confirmCase.explanation"
                defaultMessage="The selected style uses sentence case for titles. We can convert titles automatically, but you may still need to fix proper nouns manually."
              />
            </p>

            <p>
              <FormattedMessage
                id="zbib.confirmCase.titleCaseExample"
                defaultMessage="<b>Title case (as entered):</b> <i>{ titleCaseExample }</i>"
                values={{ ...commonFormats, titleCaseExample }}
              />
            </p>
            <p>
              <FormattedMessage
                id="zbib.confirmCase.conversionExample"
                defaultMessage="<b>Automatic conversion:</b> <i>{ conversionExample }</i>"
                values={{ ...commonFormats, conversionExample }}
              />
            </p>
            <p>
              <FormattedMessage
                id="zbib.confirmCase.sentenceCaseExample"
                defaultMessage="<b>Sentence case (corrected):</b> <i>{ sentenceCaseExample }</i>"
                values={{ ...commonFormats, sentenceCaseExample }} //eslint-disable-line react/display-name
              />
            </p>
          </Confirmation>
          <Modal
            isOpen={props.activeDialog === "SAVE_TO_ZOTERO"}
            contentlabel={saveToZotero}
            onRequestClose={props.onSaveToZoteroHide}
            className={cx("modal modal-centered")}
          >
            <div className="modal-content" tabIndex={-1}>
              <div className="modal-header">
                <ShadcnButton
                  variant="ghost"
                  size="icon"
                  onClick={props.onSaveToZoteroHide}
                >
                  <X className="h-6 w-6 text-primary" aria-hidden="true" />
                </ShadcnButton>
              </div>
              <div className="modal-body">
                <p>
                  <FormattedMessage
                    id="zbib.saveToZotero.message"
                    defaultMessage="After you’ve <a>installed Zotero and the Zotero Connector</a>, use the “Save to Zotero” button in your browser’s toolbar to export your bibliography."
                    values={{
                      a: (chunk) => (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.zotero.org/download/"
                        >
                          {chunk}
                        </a>
                      ), //eslint-disable-line react/display-name
                    }}
                  />
                </p>
              </div>
            </div>
          </Modal>
          <CopyCitationDialog
            {...pick(props, [
              "activeDialog",
              "copyCitationState",
              "isNoteStyle",
              "isNumericStyle",
              "onCitationCopy",
              "onCitationCopyDialogClose",
              "onCitationModifierChange",
            ])}
          />
          {props.isReady && (
            <Editor
              {...pick(props, [
                "activeDialog",
                "editorItem",
                "meta",
                "onEditorClose",
                "onError",
                "onItemCreated",
                "onItemUpdate",
              ])}
            />
          )}
          <MultipleChoiceDialog
            {...pick(props, [
              "activeDialog",
              "isTranslatingMore",
              "moreItemsLink",
              "multipleChoiceItems",
              "onMultipleChoiceCancel",
              "onMultipleChoiceMore",
              "onMultipleChoiceSelect",
            ])}
          />
          <StyleInstaller
            {...pick(props, [
              "activeDialog",
              "citationStyle",
              "citationStyles",
              "isStylesDataLoading",
              "onStyleInstallerCancel",
              "onStyleInstallerDelete",
              "onStyleInstallerSelect",
              "stylesData",
            ])}
          />
          <ConfirmAddDialog
            {...pick(props, [
              "activeDialog",
              "onConfirmAddCancel",
              "onConfirmAddConfirm",
              "incomingStyle",
              "itemToConfirm",
              "selectedStyle",
            ])}
          />
          <MultipleItemDialog
            {...pick(props, [
              "activeDialog",
              "multipleItems",
              "multipleChoiceItems",
              "onMultipleItemsCancel",
              "onMultipleItemsSelect",
            ])}
          />
        </Fragment>
      )}
    </div>
  );
};

ZBib.propTypes = {
  activeDialog: PropTypes.string,
  bibliography: PropTypes.object,
  citationHtml: PropTypes.string,
  citationToCopy: PropTypes.string,
  errorMessage: PropTypes.string,
  hydrateItemsCount: PropTypes.number,
  isConfirmingStyleSwitch: PropTypes.bool,
  isHydrated: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isReady: PropTypes.bool,
  isSaveToZoteroVisible: PropTypes.bool,
  isTranslating: PropTypes.bool,
  itemUnderReview: PropTypes.object,
  itemUnderReviewBibliography: PropTypes.object,
  lastDeletedItem: PropTypes.object,
  messages: PropTypes.array.isRequired,
  onCitationCopy: PropTypes.func.isRequired,
  onCitationModifierChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onGetStartedClick: PropTypes.func,
  onHelpClick: PropTypes.func.isRequired,
  onAboutClick: PropTypes.func.isRequired,
  onExamplesClick: PropTypes.func.isRequired,
  onBibliographyClick: PropTypes.func.isRequired,
  onAddCitationClick: PropTypes.func.isRequired,
  onReadMore: PropTypes.func.isRequired,
  onSaveToZoteroHide: PropTypes.func.isRequired,
  onStyleSwitchCancel: PropTypes.func.isRequired,
  onStyleSwitchConfirm: PropTypes.func.isRequired,
  onUndoDelete: PropTypes.func.isRequired,
};

export default memo(ZBib);
