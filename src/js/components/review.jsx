import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { Button as ShadcnButton } from "./ui/button";
import { formatBib, formatFallback } from "web-common/cite";
import { FormattedMessage } from "react-intl";
import { useFocusManager } from "web-common/hooks";
import copy from "copy-to-clipboard";
import { CircleX, Trash, SquarePen, Copy, Check } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
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

  const handleReviewCopyCitation = useCallback(async () => {
    if (!html) {
      return;
    }

    const plain = stripHtml(html);
    let copied = false;

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard?.write &&
      typeof window !== "undefined" &&
      window.ClipboardItem
    ) {
      try {
        await navigator.clipboard.write([
          new window.ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
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
        copyResetTimeout.current = null;
      }, 1500);
      resetFocus();
    }
  }, [html, stripHtml, resetFocus]);

  useEffect(() => {
    setIsCopied(false);
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
    },
    [],
  );

  return (
    <section aria-labelledby={id} className="pb-10">
      {isTranslating ? (
        <h2 id={id}>
          <FormattedMessage
            id="zbib.review.newItem"
            defaultMessage="New item…"
          />
        </h2>
      ) : (
        <Fragment>
          <Card>
            <CardHeader>
              <CardTitle>
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
              <h3 className="my-2 text-muted-foreground font-bold">
                <FormattedMessage
                  id="zbib.review.citation"
                  defaultMessage="Citation"
                />
              </h3>
              <div
                className="bg-background p-6 rounded-lg border shadow-md text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <h3 className="my-2 text-muted-foreground font-bold">
                <FormattedMessage
                  id="zbib.review.filename"
                  defaultMessage="Filename"
                />
              </h3>
              <div
                className="bg-background p-6 rounded-lg border shadow-md text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </CardContent>
            <CardFooter>
              <div className="">
                <div
                  className="flex flex-wrap gap-2 justify-center"
                  role="toolbar"
                  tabIndex={0}
                  ref={toolbarRef}
                  onKeyDown={handleKeyDown}
                  onFocus={receiveFocus}
                  onBlur={receiveBlur}
                >
                  <ShadcnButton
                    tabIndex={-2}
                    onClick={handleReviewEdit}
                    variant="outline"
                  >
                    <Copy className="size-4" aria-hidden="true" />
                    <FormattedMessage
                      id="zbib.review.copyFilename"
                      defaultMessage="Copy Filename"
                    />
                  </ShadcnButton>
                  <ShadcnButton
                    tabIndex={-2}
                    type="button"
                    variant="outline"
                    onClick={handleReviewCopyCitation}
                    aria-live="polite"
                    className="flex items-center gap-2"
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
                    onClick={handleReviewDelete}
                    variant="destructive"
                  >
                    <Trash className="size-4" aria-hidden="true" />
                    <FormattedMessage
                      id="zbib.general.delete"
                      defaultMessage="Delete"
                    />
                  </ShadcnButton>
                  <ShadcnButton tabIndex={-2} onClick={handleReviewEdit}>
                    <SquarePen className="size-4" aria-hidden="true" />
                    <FormattedMessage
                      id="zbib.general.edit"
                      defaultMessage="Edit"
                    />
                  </ShadcnButton>
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
