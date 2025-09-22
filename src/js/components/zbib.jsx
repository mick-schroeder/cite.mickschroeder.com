import { Fragment, memo, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useIntl, FormattedMessage } from "react-intl";
import { Button as ShadcnButton } from "./ui/button";
import { X } from "lucide-react";
import { pick } from "web-common/utils";
import { useFocusManager } from "web-common/hooks";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import { buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";

import About2 from "./about2";
import Examples from "./examples";

//import Brand from './brand';
import BibliographySection from "./bibliographySection";
import CiteTools from "./cite-tools";
import ConfirmAddDialog from "./confirm-add-dialog";
import Confirmation from "./confirmation";
import CopyCitationDialog from "./copy-citation-dialog";
import Editor from "./editor";
import Footer from "./footer";
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
  const navLinkClass = cx(
    buttonVariants({ variant: "ghost", size: "sm" }),
    "px-3 text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

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
    <div className={cx(className)}>
      <div className="zotero-bib-inner">
        <div className="container-wrapper flex-1 mx-auto w-full max-w-6xl xl:max-w-7xl px-4 md:px-6 overflow-x-hidden">
          <header className="bg-background top-0 z-50 w-full">
            <nav
              className="meta-nav -mx-4 px-4 flex items-center gap-2 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none]"
              aria-label={navLabel}
              tabIndex={0}
              ref={navRef}
              onFocus={receiveFocus}
              onBlur={receiveBlur}
              onKeyDown={handleKeyDown}
            >
              <span className="sr-only">Horizontal scroll for more</span>
              <NavigationMenu
                className="ml-auto bg-background/70 px-2 py-1 backdrop-blur-sm"
                viewport={false}
              >
                <NavigationMenuList className="justify-end gap-1 md:gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navLinkClass}
                      tabIndex={-2}
                    >
                      <button type="button" onClick={props.onAboutClick}>
                        <FormattedMessage
                          id="zbib.about"
                          defaultMessage="About"
                        />
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navLinkClass}
                      tabIndex={-2}
                    >
                      <button type="button" onClick={props.onHelpClick}>
                        <FormattedMessage
                          id="zbib.help"
                          defaultMessage="Help"
                        />
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navLinkClass}
                      tabIndex={-2}
                    >
                      <button type="button" onClick={props.onExamplesClick}>
                        <FormattedMessage
                          id="zbib.examples"
                          defaultMessage="Examples"
                        />
                      </button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navLinkClass}
                      tabIndex={-2}
                    >
                      <a href="/faq">FAQ</a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navLinkClass}
                      tabIndex={-2}
                    >
                      <a
                        href="https://www.mickschroeder.com"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Mick Schroeder
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
            <div className="messages break-words">
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
            </div>
          </header>
          <div className="flex justify-center py-2">
            <Badge
              variant="secondary"
              className="rounded-full bg-card border border-border px-6 py-2 transition-colors max-w-full"
            >
              <span className="flex flex-wrap items-center justify-center text-center gap-x-2">
                <img
                  src="/static/images/icon-cite-round.svg"
                  className="h-6 w-auto mr-2 mb-1 sm:mb-0"
                  alt=""
                  aria-hidden="true"
                />
                <a
                  href="https://www.mickschroeder.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl font-black tracking-tighter self-center break-words sm:whitespace-nowrap text-foreground/60 hover:text-foreground hover:underline transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Mick Schroeder's
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center basis-full sm:basis-auto mt-1 sm:mt-0 hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="text-xl font-black tracking-tighter self-center break-words sm:whitespace-nowrap text-foreground">
                    Citation Generator
                  </span>
                </a>
              </span>
            </Badge>
          </div>
          <div className="mb-6 text-center">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              <FormattedMessage
                id="zbib.brand.description"
                defaultMessage="What do you want to cite?"
              />
            </h2>
            <p className="text-muted-foreground text-xl">
              <FormattedMessage
                id="zbib.brand.description"
                defaultMessage="Pick from 10,000+ citation styles, then enter a URL, identifier, or title to begin your bibliography."
              />
            </p>
          </div>

          <div className="py-4">
            <div className="grid gap-6 xl:grid-cols-5 xl:items-start">
              <div className="flex flex-col gap-6 xl:col-span-2 min-w-0">
                {!props.isReadOnly && (
                  <section className="section section-cite">
                    <div className="">
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
                    </div>
                  </section>
                )}
                <Examples />
              </div>
              <div className="xl:col-span-3 min-w-0">
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
              </div>
            </div>
          </div>
          {!props.isReadOnly && (
            <About2 onGetStartedClick={props.onGetStartedClick} />
          )}
          <Footer {...pick(props, ["isReadOnly"])} />
        </div>
        {/*
					!props.isReadOnly && (
						<section
							aria-labelledby="link-to-this-version"
							className="section section-link space-y-4">
							<div className="container">
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
							<div className="container">
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
              contentLabel={saveToZotero}
              onRequestClose={props.onSaveToZoteroHide}
              className={cx("modal modal-centered")}
            >
              <div className="modal-content" tabIndex={-1}>
                <div className="modal-header">
                  <h4 className="modal-title text-truncate text-lg font-semibold">
                    {saveToZotero}
                  </h4>
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
  onReadMore: PropTypes.func.isRequired,
  onSaveToZoteroHide: PropTypes.func.isRequired,
  onStyleSwitchCancel: PropTypes.func.isRequired,
  onStyleSwitchConfirm: PropTypes.func.isRequired,
  onUndoDelete: PropTypes.func.isRequired,
};

export default memo(ZBib);
