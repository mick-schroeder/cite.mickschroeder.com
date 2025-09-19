import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { X, Info, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { Button as ShadcnButton } from "./ui/button";

const Message = ({
  action,
  id,
  message,
  kind,
  href,
  onDismiss,
  onReadMore,
  onShowDuplicate,
  onUndoDelete,
}) => {
  let category;
  const htmlID = `message-${id}`;

  switch (kind) {
    case "UNDO_DELETE":
      category = "warning";
      break;
    case "FIRST_CITATION":
      category = "success";
      break;
    case "ERROR":
      category = "error";
      break;
    case "DUPLICATE":
      category = "warning";
      break;
    default:
      category = "info";
      break;
  }

  const handleAction = useCallback(
    (ev) => {
      switch (kind) {
        case "WELCOME_MESSAGE":
          onReadMore(ev);
          break;
        case "UNDO_DELETE":
          onUndoDelete();
          break;
        case "DUPLICATE":
          onShowDuplicate(ev);
          break;
      }
    },
    [kind, onReadMore, onShowDuplicate, onUndoDelete],
  );

  const handleDismiss = useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  return (
    <div
      aria-live="polite"
      aria-labelledby={htmlID}
      role="status"
      className={cx(
        "relative mx-auto max-w-2xl rounded-lg border p-4 shadow-sm flex flex-col items-center gap-3",
        {
          info:
            "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100",
          success:
            "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/50 dark:text-green-100",
          warning:
            "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
          error:
            "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100",
        }[category],
      )}
    >
      {/* Dismiss */}
      <ShadcnButton
        title="Dismiss"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        onClick={handleDismiss}
        aria-label="Dismiss message"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </ShadcnButton>

      <div className="flex items-center justify-center gap-3 text-current w-full flex-wrap">
        {
          {
            info: <Info className="h-5 w-5" aria-hidden="true" />,
            success: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
            warning: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
            error: <AlertOctagon className="h-5 w-5" aria-hidden="true" />,
          }[category]
        }
        <p id={htmlID} className="text-md font-semibold leading-relaxed">
          {message}
        </p>
        {action && (
          href ? (
            <ShadcnButton
              asChild
              size="sm"
              variant="outline"
              className={cx(
                "h-8",
                {
                  info:
                    "border-sky-300 text-sky-900 hover:bg-sky-100 dark:border-sky-700 dark:text-sky-100 dark:hover:bg-sky-900/50",
                  success:
                    "border-green-300 text-green-900 hover:bg-green-100 dark:border-green-700 dark:text-green-100 dark:hover:bg-green-900/50",
                  warning:
                    "border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/50",
                  error:
                    "border-red-300 text-red-900 hover:bg-red-100 dark:border-red-700 dark:text-red-100 dark:hover:bg-red-900/50",
                }[category],
              )}
            >
              <a href={href}>{action}</a>
            </ShadcnButton>
          ) : (
            <ShadcnButton
              variant="outline"
              size="sm"
              onClick={handleAction}
              className={cx(
                "h-8",
                {
                  info:
                    "border-sky-300 text-sky-900 hover:bg-sky-100 dark:border-sky-700 dark:text-sky-100 dark:hover:bg-sky-900/50",
                  success:
                    "border-green-300 text-green-900 hover:bg-green-100 dark:border-green-700 dark:text-green-100 dark:hover:bg-green-900/50",
                  warning:
                    "border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/50",
                  error:
                    "border-red-300 text-red-900 hover:bg-red-100 dark:border-red-700 dark:text-red-100 dark:hover:bg-red-900/50",
                }[category],
              )}
            >
              {action}
            </ShadcnButton>
          )
        )}
      </div>
    </div>
  );
};

Message.propTypes = {
  id: PropTypes.number,
  action: PropTypes.string,
  href: PropTypes.string,
  kind: PropTypes.oneOf([
    "DUPLICATE",
    "ERROR",
    "FIRST_CITATION",
    "INFO",
    "UNDO_DELETE",
    "WELCOME_MESSAGE",
  ]).isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onDismiss: PropTypes.func.isRequired,
  onReadMore: PropTypes.func,
  onUndoDelete: PropTypes.func,
  onShowDuplicate: PropTypes.func,
};

export default memo(Message);
