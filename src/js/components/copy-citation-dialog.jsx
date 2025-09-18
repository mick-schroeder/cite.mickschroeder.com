import cx from "classnames";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState, useMemo, memo } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Spinner } from "web-common/components";
import { usePrevious } from "web-common/hooks";
import Modal from "./modal";
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button as ShadcnButton } from "./ui/button";
import { Input as ShadcnInput } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const CopyCitationDialog = (props) => {
  const {
    activeDialog,
    copyCitationState,
    isNoteStyle,
    isNumericStyle,
    onCitationCopy,
    onCitationCopyDialogClose,
    onCitationModifierChange,
  } = props;
  const prevActiveDialog = usePrevious(activeDialog);
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useRef(null);
  const intl = useIntl();
  const isReady = !!copyCitationState.inTextHtml;
  const wasReady = usePrevious(isReady);
  const inputRef = useRef(null);
  const title = isNoteStyle
    ? intl.formatMessage({
        id: "zbib.citation.copyNote",
        defaultMessage: "Copy Note",
      })
    : intl.formatMessage({
        id: "zbib.citation.copyCitation",
        defaultMessage: "Copy Citation",
      });

  const locators = useMemo(
    () => [
      {
        value: "page",
        label: intl.formatMessage({
          id: "zbib.locator.page",
          defaultMessage: "Page",
        }),
      },
      {
        value: "book",
        label: intl.formatMessage({
          id: "zbib.locator.book",
          defaultMessage: "Book",
        }),
      },
      {
        value: "chapter",
        label: intl.formatMessage({
          id: "zbib.locator.chapter",
          defaultMessage: "Chapter",
        }),
      },
      {
        value: "column",
        label: intl.formatMessage({
          id: "zbib.locator.column",
          defaultMessage: "Column",
        }),
      },
      {
        value: "figure",
        label: intl.formatMessage({
          id: "zbib.locator.figure",
          defaultMessage: "Figure",
        }),
      },
      {
        value: "folio",
        label: intl.formatMessage({
          id: "zbib.locator.folio",
          defaultMessage: "Folio",
        }),
      },
      {
        value: "issue",
        label: intl.formatMessage({
          id: "zbib.locator.issue",
          defaultMessage: "Issue",
        }),
      },
      {
        value: "line",
        label: intl.formatMessage({
          id: "zbib.locator.line",
          defaultMessage: "Line",
        }),
      },
      {
        value: "note",
        label: intl.formatMessage({
          id: "zbib.locator.note",
          defaultMessage: "Note",
        }),
      },
      {
        value: "opus",
        label: intl.formatMessage({
          id: "zbib.locator.opus",
          defaultMessage: "Opus",
        }),
      },
      {
        value: "paragraph",
        label: intl.formatMessage({
          id: "zbib.locator.paragraph",
          defaultMessage: "Paragraph",
        }),
      },
      {
        value: "part",
        label: intl.formatMessage({
          id: "zbib.locator.part",
          defaultMessage: "Part",
        }),
      },
      {
        value: "section",
        label: intl.formatMessage({
          id: "zbib.locator.section",
          defaultMessage: "Section",
        }),
      },
      {
        value: "sub verbo",
        label: intl.formatMessage({
          id: "zbib.locator.subverbo",
          defaultMessage: "Sub Verbo",
        }),
      },
      {
        value: "verse",
        label: intl.formatMessage({
          id: "zbib.locator.verse",
          defaultMessage: "Verse",
        }),
      },
      {
        value: "volume",
        label: intl.formatMessage({
          id: "zbib.locator.volume",
          defaultMessage: "Volume",
        }),
      },
    ],
    [intl],
  );

  let isCitationEmpty = false;

  if (typeof citationHtml === "string") {
    isCitationEmpty =
      copyCitationState.inTextHtml.replace(/<[^>]*>/g, "").trim().length === 0;
  }

  const handleLabelChange = useCallback(
    (newValue) =>
      onCitationModifierChange({
        ...copyCitationState.modifiers,
        label: newValue,
      }),
    [copyCitationState.modifiers, onCitationModifierChange],
  );

  const handleLocatorChange = useCallback(
    (newValue) =>
      onCitationModifierChange({
        ...copyCitationState.modifiers,
        locator: newValue,
      }),
    [copyCitationState.modifiers, onCitationModifierChange],
  );

  const handleSuppressAuthorChange = useCallback(
    (ev) =>
      onCitationModifierChange({
        ...copyCitationState.modifiers,
        mode: ev.currentTarget.checked ? "SuppressAuthor" : undefined,
      }),
    [copyCitationState.modifiers, onCitationModifierChange],
  );

  const handleCancel = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    onCitationCopyDialogClose();
  }, [onCitationCopyDialogClose]);

  const handleConfirm = useCallback(() => {
    if (onCitationCopy()) {
      setIsCopied(true);
      timeout.current = setTimeout(() => {
        onCitationCopyDialogClose();
        setIsCopied(false);
      }, 1000);
    }
  }, [onCitationCopy, onCitationCopyDialogClose]);

  const handleInputCommit = useCallback(
    (_val, _hasChanged, ev) => {
      if (ev.type === "keydown") {
        handleConfirm();
        ev.preventDefault();
      }
    },
    [handleConfirm],
  );

  useEffect(() => {
    if (prevActiveDialog !== activeDialog) {
      setIsCopied(false);
    }
  }, [
    activeDialog,
    copyCitationState.initialMode,
    isNumericStyle,
    prevActiveDialog,
  ]);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && !wasReady) {
      inputRef.current.focus();
    }
  }, [isReady, wasReady]);

  return (
    <Modal
      className={cx("modal modal-centered copy-citation-dialog", {
        loading:
          !copyCitationState.inTextHtml || !copyCitationState.bibliographyHtml,
      })}
      isOpen={activeDialog === "COPY_CITATION"}
      contentLabel={title}
      onRequestClose={onCitationCopyDialogClose}
    >
      {copyCitationState.inTextHtml ? (
        <div className="modal-content" tabIndex={-1}>
          <div className="modal-header">
            <h4 className="modal-title text-truncate">{title}</h4>
          </div>
          <div className="modal-body">
            <div className="form-row form-group">
              <div className="col-xs-6">
                <ShadcnSelect
                  value={copyCitationState.modifiers.label || "page"}
                  onValueChange={handleLabelChange}
                  disabled={isCopied}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-label={intl.formatMessage({
                      id: "zbib.citation.locatorLabel",
                      defaultMessage: "Locator Label",
                    })}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top" position="popper" sticky="always" sideOffset={4}>
                    {locators.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </ShadcnSelect>
              </div>
              <div className="col-xs-6">
                <ShadcnInput
                  aria-label={intl.formatMessage({
                    id: "zbib.citation.locator",
                    defaultMessage: "Locator",
                  })}
                  name="Locator"
                  disabled={isCopied}
                  onChange={(e) => handleLocatorChange(e.target.value)}
                  onKeyDown={(e) => handleInputCommit(null, null, e)}
                  tabIndex={0}
                  value={copyCitationState.modifiers.locator || ""}
                  placeholder="Number"
                  ref={inputRef}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="omit-author"
                  disabled={isCopied}
                  checked={copyCitationState.modifiers.mode === "SuppressAuthor"}
                  onCheckedChange={(checked) =>
                    handleSuppressAuthorChange({ currentTarget: { checked: Boolean(checked) } })
                  }
                />
                <Label htmlFor="omit-author" className="text-sm">
                  <FormattedMessage id="zbib.citation.omitAuthor" defaultMessage="Omit Author" />
                </Label>
              </div>
            </div>
            <div>
              <h5 id="copy-citation-preview-header">
                <FormattedMessage
                  id="zbib.citation.preview"
                  defaultMessage="Preview"
                />
                <span role="presentation" aria-hidden="true">
                  :
                </span>
              </h5>
              <figure
                aria-labelledby="copy-citation-preview-header"
                className="bg-background p-6 rounded-lg border shadow-md text-sm"
                dangerouslySetInnerHTML={{
                  __html: copyCitationState.inTextHtml,
                }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <div className="buttons">
              <ShadcnButton variant="outline" onClick={handleCancel}>
                <FormattedMessage
                  id="zbib.general.cancel"
                  defaultMessage="Cancel"
                />
              </ShadcnButton>
              <ShadcnButton
               variant="outline"
                disabled={isCitationEmpty}
                onClick={handleConfirm}
              >
                <span className={cx("inline-feedback", { active: isCopied })}>
                  <span className="default-text" aria-hidden={isCopied}>
                    {title}
                  </span>
                  <span className="shorter feedback" aria-hidden={!isCopied}>
                    <FormattedMessage
                      id="zbib.citation.copiedFeedback"
                      defaultMessage="Copied!"
                    />
                  </span>
                </span>
              </ShadcnButton>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};

CopyCitationDialog.propTypes = {
  activeDialog: PropTypes.string,
  copyCitationState: PropTypes.object,
  isNoteStyle: PropTypes.bool,
  isNumericStyle: PropTypes.bool,
  onCitationCopy: PropTypes.func.isRequired,
  onCitationCopyDialogClose: PropTypes.func.isRequired,
  onCitationModifierChange: PropTypes.func.isRequired,
};

export default memo(CopyCitationDialog);
