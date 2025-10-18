import { useCallback, useEffect, useRef, useState, memo } from "react";
import PropTypes from "prop-types";
import { useIntl, FormattedMessage } from "react-intl";
import { Button as ShadcnButton } from "./ui/button";
import { cn } from "../lib/utils";
import { Loader2, X, PlusCircle, Search, BookType } from "lucide-react";
import Input from "./form/input";
import { usePrevious } from "web-common/hooks";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Brand from "./brand";
import StyleSelector from "./style-selector";
import { Quote, FilePenLine } from "lucide-react";

const canCancel = typeof AbortController === "function";

const CiteTools = ({
  identifier,
  isTranslating,
  onEditorOpen,
  onTranslationCancel,
  onTranslationRequest,
  citationStyle,
  citationStyles,
  onCitationStyleChanged,
}) => {
  const inputRef = useRef(null);
  const [entry, setEntry] = useState(identifier);
  const prevIdentifier = usePrevious(identifier);
  const wasTranslating = usePrevious(isTranslating);
  const intl = useIntl();
  const prompt = intl.formatMessage({
    id: "zbib.citePrompt",
    defaultMessage: 'Enter a URL, PubMed ID (PMID), ISBN, DOI, arXiv ID..."',
  });

  const styleOptions = Array.isArray(citationStyles) ? citationStyles : [];
  const handleStyleChange = onCitationStyleChanged ?? (() => {});
  const selectedStyle = citationStyle ?? "";

  const handleChange = useCallback((newValue) => {
    setEntry(newValue);
  }, []);

  const handleCiteOrCancel = useCallback(() => {
    if (isTranslating) {
      onTranslationCancel();
    } else if (entry.length > 0 && !isTranslating) {
      onTranslationRequest(entry);
    }
  }, [entry, isTranslating, onTranslationCancel, onTranslationRequest]);

  const handlePaste = useCallback(
    (ev) => {
      const clipboardData = ev.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData("Text");
      const isMultiLineData =
        pastedData.split("\n").filter((line) => line.trim().length > 0).length >
        1;

      if (!isMultiLineData) {
        return;
      }

      ev.preventDefault();
      setEntry(pastedData);
      onTranslationRequest(pastedData, null, false, true);
    },
    [onTranslationRequest],
  );

  useEffect(() => {
    if (
      typeof (prevIdentifier !== "undefined") &&
      identifier !== prevIdentifier
    ) {
      setEntry(identifier);
    }
  }, [identifier, prevIdentifier]);

  useEffect(() => {
    if (wasTranslating && !isTranslating) {
      inputRef.current?.focus();
    }
  }, [isTranslating, wasTranslating]);

  const actionVariant = isTranslating
    ? canCancel
      ? "destructive"
      : "loading"
    : "default";
  const isActionDisabled = isTranslating ? !canCancel : entry.length === 0;

  const handleInputChange = useCallback(
    (event) => {
      handleChange(event.target.value);
    },
    [handleChange],
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCiteOrCancel();
      } else if (event.key === "Escape" && isTranslating && canCancel) {
        event.preventDefault();
        onTranslationCancel();
      }
    },
    [canCancel, handleCiteOrCancel, isTranslating, onTranslationCancel],
  );

  return (
    <section id="section-cite" className="section section-cite ">
      <Card>
        <CardHeader>
          <CardTitle>
            <PlusCircle
              className="inline h-5 w-5 text-primary mr-2"
              aria-hidden="true"
            />
            <FormattedMessage
              id="zbib.addCitation"
              defaultMessage="Add Citation"
            />
          </CardTitle>
          <CardAction>
            <ShadcnButton
              variant="outline"
              size="sm"
              onClick={onEditorOpen}
              className="gap-2"
            >
              <FilePenLine />
              <FormattedMessage
                id="zbib.manualEntry"
                defaultMessage="Manual Entry"
              />
            </ShadcnButton>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <label className="text-sm font-medium  inline-flex items-center gap-2">
              <BookType className="size-4 text-primary" aria-hidden="true" />
              {intl.formatMessage({
                id: "zbib.selectStyle",
                defaultMessage: "Select Citation Style",
              })}
            </label>
            <StyleSelector
              className="min-w-[220px]"
              citationStyle={selectedStyle}
              citationStyles={styleOptions}
              onCitationStyleChanged={onCitationStyleChanged}
            />
            <div className="flex w-full flex-col gap-2 text-left">
              <label className="text-sm font-medium  inline-flex items-center gap-2">
                <Search className="size-4 text-primary" aria-hidden="true" />
                {intl.formatMessage({
                  id: "zbib.enterQuery",
                  defaultMessage: "Enter Query",
                })}
              </label>
              <div className="relative">
                <Input
                  aria-label={prompt}
                  autoFocus
                  className="form-control form-control-lg id-input bg-background text-foreground mt-2"
                  isBusy={isTranslating}
                  isReadOnly={isTranslating}
                  onBlur={() => true /* do not commit on blur */}
                  onChange={handleChange}
                  onCommit={handleCiteOrCancel}
                  onPaste={handlePaste}
                  placeholder={prompt}
                  ref={inputRef}
                  tabIndex={0}
                  type="search"
                  value={entry}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <ShadcnButton
            variant={actionVariant}
            size="lg"
            className={cn("w-full gap-2 sm:w-auto")}
            //disabled={isActionDisabled}
            onClick={handleCiteOrCancel}
            aria-busy={isTranslating && !canCancel}
          >
            {isTranslating ? (
              canCancel ? (
                <span className="inline-flex items-center gap-2">
                  <X className="size-4" aria-hidden="true" />
                  <FormattedMessage
                    id="zbib.general.cancel"
                    defaultMessage="Cancel"
                  />
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <FormattedMessage
                    id="zbib.general.cite"
                    defaultMessage="Suggest Citation"
                  />
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-2">
                <Quote />
                <FormattedMessage
                  id="zbib.general.cite"
                  defaultMessage="Suggest Citation"
                />
              </span>
            )}
          </ShadcnButton>
        </CardFooter>
      </Card>
    </section>
  );
};

CiteTools.propTypes = {
  identifier: PropTypes.string,
  isTranslating: PropTypes.bool,
  onEditorOpen: PropTypes.func.isRequired,
  onTranslationCancel: PropTypes.func.isRequired,
  onTranslationRequest: PropTypes.func.isRequired,
  citationStyle: PropTypes.string,
  citationStyles: PropTypes.array,
  onCitationStyleChanged: PropTypes.func,
};

export default memo(CiteTools);
