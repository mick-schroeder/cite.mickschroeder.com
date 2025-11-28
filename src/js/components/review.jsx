import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { Button as ShadcnButton } from "./ui/button";
import { formatBib, formatFallback } from "web-common/cite";
import { FormattedMessage } from "react-intl";
import { useFocusManager } from "web-common/hooks";
import copy from "copy-to-clipboard";
import { minimizeCitationMarkup } from "../utils/minimizeCitationMarkup";
import {
  Quote,
  FileText,
  CircleX,
  Trash,
  SquarePen,
  Copy,
  Check,
  ExternalLink,
  BookOpenCheck,
} from "lucide-react";
import { buildCitationFilename, buildUnpaywallUrl } from "../filename";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Spinner } from "./ui/spinner";

const Review = ({
  isTranslating,
  itemUnderReview,
  onReviewEdit,
  onReviewDelete,
  onReviewDismiss,
  styleHasBibliography,
}) => {
  const { bibliographyItems, bibliographyMeta } = itemUnderReview || {};
  const id = useId();
  const html = itemUnderReview
    ? styleHasBibliography
      ? formatBib(bibliographyItems, bibliographyMeta)
      : formatFallback(bibliographyItems)
    : "";
  const toolbarRef = useRef(null);
  const copyResetTimeout = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedFilename, setIsCopiedFilename] = useState(false);

  const { focusNext, focusPrev, receiveFocus, receiveBlur } =
    useFocusManager(toolbarRef);

  const handleKeyDown = useCallback(
    (ev) => {
      if (ev.key == "ArrowLeft") {
        focusPrev(ev, { useCurrentTarget: false });
      } else if (ev.key == "ArrowRight") {
        focusNext(ev, { useCurrentTarget: false });
      }
    },
    [focusNext, focusPrev],
  );

  const resetFocus = useCallback(() => {
    document.querySelector(".id-input").focus();
  }, []);

  const handleReviewDismiss = useCallback(
    (ev) => {
      resetFocus();
      onReviewDismiss(ev);
    },
    [onReviewDismiss, resetFocus],
  );

  const handleReviewDelete = useCallback(
    (ev) => {
      resetFocus();
      onReviewDelete(ev);
    },
    [onReviewDelete, resetFocus],
  );

  const handleReviewEdit = useCallback(
    (ev) => {
      resetFocus();
      onReviewEdit(ev);
    },
    [onReviewEdit, resetFocus],
  );

  const stripHtml = useCallback((markup) => {
    const container = document.createElement("div");
    container.innerHTML = markup;
    return container.textContent || container.innerText || "";
  }, []);

  const plainCitation = useMemo(
    () => (html ? stripHtml(html) : ""),
    [html, stripHtml],
  );

  const filename = useMemo(() => {
    if (!itemUnderReview?.item) {
      return "";
    }
    return buildCitationFilename(itemUnderReview.item, plainCitation);
  }, [itemUnderReview, plainCitation]);

  const unpaywallUrl = useMemo(() => {
    if (!itemUnderReview?.item) return null;
    return buildUnpaywallUrl(itemUnderReview.item);
  }, [itemUnderReview]);

  const handleReviewCopyCitation = useCallback(async () => {
    if (!html) {
      return;
    }

    const minimized = minimizeCitationMarkup(html);
    const htmlToCopy = minimized.html || html;
    const plain = minimized.text || plainCitation;
    const copyParts = [{ mime: "text/plain", data: plain }];
    if (minimized.rtf) {
      copyParts.push({ mime: "text/rtf", data: minimized.rtf });
    }
    if (htmlToCopy) {
      copyParts.push({ mime: "text/html", data: htmlToCopy });
    }

    let copied = false;

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard?.write &&
      typeof window !== "undefined" &&
      window.ClipboardItem
    ) {
      try {
        const clipboardItem = new window.ClipboardItem(
          Object.fromEntries(
            copyParts.map(({ mime, data }) => [
              mime,
              new Blob([data], { type: mime }),
            ]),
          ),
        );
        await navigator.clipboard.write([clipboardItem]);
        copied = true;
      } catch (_) {
        copied = false;
      }
    }

    if (!copied) {
      copied = copy(plain);
    }

    if (copied) {
      setIsCopied(true);
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
      copyResetTimeout.current = setTimeout(() => {
        setIsCopied(false);
        setIsCopiedFilename(false);
        copyResetTimeout.current = null;
      }, 1500);
      resetFocus();
    }
  }, [html, minimizeCitationMarkup, plainCitation, resetFocus]);

  const handleReviewCopyFilenameCitation = useCallback(async () => {
    if (!filename) {
      return;
    }

    let copied = false;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(filename);
        copied = true;
      } catch (_) {
        copied = false;
      }
    }

    if (!copied) {
      copied = copy(filename);
    }

    if (copied) {
      setIsCopiedFilename(true);
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
      copyResetTimeout.current = setTimeout(() => {
        setIsCopied(false);
        setIsCopiedFilename(false);
        copyResetTimeout.current = null;
      }, 1500);
      resetFocus();
    }
  }, [filename, resetFocus]);

  const handleOpenUnpaywall = useCallback(() => {
    if (!unpaywallUrl) return;
    try {
      window.open(unpaywallUrl, "_blank", "noopener,noreferrer");
    } catch (_) {}
  }, [unpaywallUrl]);

  useEffect(() => {
    setIsCopied(false);
    setIsCopiedFilename(false);
    if (copyResetTimeout.current) {
      clearTimeout(copyResetTimeout.current);
      copyResetTimeout.current = null;
    }
  }, [itemUnderReview]);

  useEffect(
    () => () => {
      if (copyResetTimeout.current) {
        clearTimeout(copyResetTimeout.current);
      }
      setIsCopied(false);
      setIsCopiedFilename(false);
    },
    [],
  );

  return (
    <section aria-labelledby={id} className="pb-10">
      {isTranslating ? (
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <FormattedMessage
                id="zbib.review.newItem"
                defaultMessage="New item…"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center gap-2">
            <Spinner />
          </CardContent>
        </Card>
      ) : (
        <Fragment>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck
                  className="inline h-5 w-5 text-primary mr-2"
                  aria-hidden="true"
                />
                <FormattedMessage
                  id="zbib.review.title"
                  defaultMessage="Review Citation"
                />
              </CardTitle>
              <CardDescription>
                <h2 className="sr-only" id={id}>
                  <FormattedMessage
                    id="zbib.review.newItem"
                    defaultMessage="New item…"
                  />
                </h2>
              </CardDescription>
              <CardAction>
                {" "}
                <ShadcnButton
                  tabIndex={-2}
                  className=""
                  onClick={handleReviewDismiss}
                  variant="outline"
                >
                  <CircleX className="size-4" aria-hidden="true" />
                  <FormattedMessage
                    id="zbib.general.close"
                    defaultMessage="Close"
                  />
                </ShadcnButton>
              </CardAction>
            </CardHeader>
            <CardContent>
              <h3 className="my-2 text-muted-foreground font-bold flex items-center gap-4">
                <Quote className="size-4" aria-hidden="true" />
                <FormattedMessage
                  id="zbib.review.citation"
                  defaultMessage="Citation"
                />
              </h3>
              <div
                className="bg-background p-6 rounded-lg border shadow-sm text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <h3 className="my-2 text-muted-foreground font-bold flex items-center gap-4">
                <FileText className="size-4" aria-hidden="true" />
                <FormattedMessage
                  id="zbib.review.filename"
                  defaultMessage="Filename"
                />
              </h3>
              <div className="bg-background p-6 rounded-lg border shadow-sm text-sm break-words">
                {filename}
              </div>
            </CardContent>
            <CardFooter>
              <div
                className="w-full"
                role="toolbar"
                tabIndex={0}
                ref={toolbarRef}
                onKeyDown={handleKeyDown}
                onFocus={receiveFocus}
                onBlur={receiveBlur}
              >
                <div className="flex w-full flex-col items-center gap-4">
                  {/* Row 1: Copy actions */}
                  <div className="flex w-full flex-wrap justify-center gap-2">
                    <ShadcnButton
                      tabIndex={-2}
                      type="button"
                      variant="outline"
                      onClick={handleReviewCopyCitation}
                      aria-live="polite"
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-4" aria-hidden="true" />
                          <FormattedMessage
                            id="zbib.review.copiedCitation"
                            defaultMessage="Citation Copied"
                          />
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" aria-hidden="true" />
                          <FormattedMessage
                            id="zbib.review.copyCitation"
                            defaultMessage="Copy Citation"
                          />
                        </>
                      )}
                    </ShadcnButton>

                    <ShadcnButton
                      tabIndex={-2}
                      type="button"
                      variant="outline"
                      onClick={handleReviewCopyFilenameCitation}
                      aria-live="polite"
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      {isCopiedFilename ? (
                        <>
                          <Check className="size-4" aria-hidden="true" />
                          <FormattedMessage
                            id="zbib.review.copiedFilename"
                            defaultMessage="Filename Copied"
                          />
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" aria-hidden="true" />
                          <FormattedMessage
                            id="zbib.review.copyFilename"
                            defaultMessage="Copy Filename"
                          />
                        </>
                      )}
                    </ShadcnButton>

                    <ShadcnButton
                      tabIndex={-2}
                      type="button"
                      variant="outline"
                      onClick={handleOpenUnpaywall}
                      disabled={!unpaywallUrl}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      <FormattedMessage
                        id="zbib.review.unpaywallPdf"
                        defaultMessage="Unpaywall PDF"
                      />
                    </ShadcnButton>
                  </div>

                  {/* Row 2: Edit/Delete */}
                  <div className="flex w-full flex-wrap justify-center gap-2">
                    <ShadcnButton
                      tabIndex={-2}
                      onClick={handleReviewDelete}
                      variant="destructive"
                      className="w-full sm:w-auto"
                    >
                      <Trash className="size-4" aria-hidden="true" />
                      <FormattedMessage
                        id="zbib.general.delete"
                        defaultMessage="Delete"
                      />
                    </ShadcnButton>
                    <ShadcnButton
                      tabIndex={-2}
                      onClick={handleReviewEdit}
                      className="w-full sm:w-auto"
                    >
                      <SquarePen className="size-4" aria-hidden="true" />
                      <FormattedMessage
                        id="zbib.general.edit"
                        defaultMessage="Edit"
                      />
                    </ShadcnButton>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Fragment>
      )}
    </section>
  );
};

Review.propTypes = {
  isTranslating: PropTypes.bool,
  itemUnderReview: PropTypes.object,
  onReviewDelete: PropTypes.func.isRequired,
  onReviewDismiss: PropTypes.func.isRequired,
  onReviewEdit: PropTypes.func.isRequired,
  styleHasBibliography: PropTypes.bool,
};

export default memo(Review);
