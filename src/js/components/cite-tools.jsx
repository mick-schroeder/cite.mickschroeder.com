import { useCallback, useEffect, useRef, useState, memo } from "react";
import PropTypes from "prop-types";
import { useIntl, FormattedMessage } from "react-intl";
import { Button as ShadcnButton } from "./ui/button";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";
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
    defaultMessage:
      'Enter a URL, PubMed ID (PMID), ISBN, DOI, arXiv ID, or title..."',
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
    <div className="cite-tools">
       <div className="mb-6 text-center px-6">
<h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      <FormattedMessage
                id="zbib.brand.description"
                defaultMessage="What would you like to cite?"
              />
    </h2>
        <p className="text-muted-foreground text-xl">
     <FormattedMessage
                id="zbib.brand.description"
                defaultMessage="Choose one of 10,000+ citation styles and enter your reference below to start creating your bibliography."
              />
    </p>
       </div>
      
              
      <Card>
        <CardHeader className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div className="text-left">
            <CardTitle className="">
              Enter Reference Query
            </CardTitle>
  
          </div>
          <CardAction className="">
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
            <StyleSelector
              className="min-w-[220px]"
              citationStyle={selectedStyle}
              citationStyles={styleOptions}
              onCitationStyleChanged={onCitationStyleChanged}
            />
            <div className="flex w-full flex-col gap-2 text-left">
              <label className="text-sm font-medium text-muted-foreground">
                {intl.formatMessage({
                  id: "zbib.enterQuery",
                  defaultMessage: "Enter Query",
                })}
              </label>
              <div className="relative">
                <input
                  aria-label={prompt}
                  autoFocus
                  className="id-input h-11 w-full rounded-md border border-input bg-background px-4 pr-12 text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isTranslating && !canCancel}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onPaste={handlePaste}
                  placeholder={prompt}
                  readOnly={isTranslating}
                  aria-busy={isTranslating}
                  ref={inputRef}
                  tabIndex={0}
                  type="search"
                  value={entry}
                />
                {isTranslating ? (
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <Loader2
                      className="size-4 animate-spin text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <ShadcnButton
            variant={actionVariant}
            size="lg"
            className={cn("w-full gap-2 sm:w-auto")}
            disabled={isActionDisabled}
            onClick={handleCiteOrCancel}
            aria-busy={isTranslating && !canCancel}
          >
            {isTranslating ? (
              canCancel ? (
                <FormattedMessage
                  id="zbib.general.cancel"
                  defaultMessage="Cancel"
                />
              ) : (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <FormattedMessage
                    id="zbib.general.cite"
                    defaultMessage="Suggest Citation"
                  />
                </>
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
    </div>
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
