import copy from "copy-to-clipboard";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { FormattedMessage } from "react-intl";
import { Button as ShadcnButton } from "./ui/button";
import { ClipboardCopy, FileDown, Library } from "lucide-react";

import exportFormats from "../constants/export-formats";
import cx from "classnames";

const getFormatIcon = (format, cfg) => {
  if (cfg?.isCopyable)
    return <ClipboardCopy className="h-4 w-4" aria-hidden="true" />;
  if (format === "zotero")
    return <Library className="h-4 w-4" aria-hidden="true" />;
  return <FileDown className="h-4 w-4" aria-hidden="true" />;
};

const ExportTools = (props) => {
  const { getCopyData, isHydrated, isReady, itemCount, onDownloadFile } = props;
  const [clipboardConfirmations, setClipboardConfirmations] = useState({});
  const whenReadyData = useRef(false);

  const handleClipboardSuccess = useCallback((format) => {
    setClipboardConfirmations((prev) => {
      if (prev[format]) return prev; // already showing
      const next = { ...prev, [format]: true };
      setTimeout(() => {
        setClipboardConfirmations((p) => ({ ...p, [format]: false }));
      }, 1200);
      return next;
    });
  }, []);

  const copyToClipboard = useCallback(
    async (format /*, isTopLevelButton*/) => {
      const text = await getCopyData(format);
      const ok = copy(text);
      if (ok) {
        handleClipboardSuccess(format);
      }
    },
    [getCopyData, handleClipboardSuccess],
  );

  const handleCopyFormat = useCallback(
    async (format) => {
      if (isHydrated && !isReady) {
        whenReadyData.current = { shouldCopy: true, format };
        return;
      }
      copyToClipboard(format);
    },
    [copyToClipboard, isHydrated, isReady],
  );

  const handleDownloadFormat = useCallback(
    async (format) => {
      if (isHydrated && !isReady) {
        whenReadyData.current = { shouldDownload: true, format };
        return;
      }
      onDownloadFile(format);
    },
    [isHydrated, isReady, onDownloadFile],
  );

  const isCopied = clipboardConfirmations["plain"];

  useEffect(() => {
    if (isReady && whenReadyData.current) {
      if (whenReadyData.current.shouldCopy) {
        const { format } = whenReadyData.current;
        copyToClipboard(format);
      } else if (whenReadyData.current.shouldDownload) {
        const { format } = whenReadyData.current;
        onDownloadFile(format);
      }
      whenReadyData.current = null;
    }
  }, [copyToClipboard, isReady, onDownloadFile]);

  return (
    <div className="export-tools py-4 md:px-10">
      <div className={cx("btn-group", { success: isCopied })}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {Object.keys(exportFormats).map((format) => {
            const cfg = exportFormats[format];
            const copied = !!clipboardConfirmations[format];
            if (cfg.isCopyable) {
              return (
                <ShadcnButton
                  key={format}
                  disabled={itemCount === 0 || copied}
                  size="lg"
                  onClick={() => handleCopyFormat(format)}
                  data-format={format}
                  className="clipboard-trigger w-full justify-center"
                >
                  <span className="inline-flex items-center gap-2">
                    {getFormatIcon(format, cfg)}
                    <span aria-live="polite">
                      {copied ? (
                        <FormattedMessage
                          id="zbib.export.copiedFeedback"
                          defaultMessage="Copied!"
                        />
                      ) : (
                        cfg.label
                      )}
                    </span>
                  </span>
                </ShadcnButton>
              );
            }
            // Downloadable button
            return (
              <ShadcnButton
                key={format}
                disabled={itemCount === 0}
                size="lg"
                variant="outline"
                onClick={() => handleDownloadFormat(format)}
                data-format={format}
                className="w-full justify-center"
              >
                <span className="inline-flex items-center gap-2">
                  {getFormatIcon(format, cfg)}
                  <span>{cfg.label}</span>
                </span>
              </ShadcnButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ExportTools.propTypes = {
  getCopyData: PropTypes.func.isRequired,
  isHydrated: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isReady: PropTypes.bool,
  itemCount: PropTypes.number,
  onDownloadFile: PropTypes.func.isRequired,
};

export default memo(ExportTools);
