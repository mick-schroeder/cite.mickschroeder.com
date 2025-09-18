import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { X } from "lucide-react";
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
      className={cx("message", category)}
    >
      <p className="text">
        <span id={htmlID}>{message}</span>
        {action &&
          (href ? (
            <a
              className={`btn btn-sm btn-outline-inverse-${category}`}
              href={href}
            >
              {action}
            </a>
          ) : (
            <ShadcnButton
              variant="outline"
              size="sm"
              onClick={handleAction}
            >
              {action}
            </ShadcnButton>
          ))}
      </p>
      <ShadcnButton
        title="Dismiss"
        variant="destructive"
        size="sm"
        onClick={handleDismiss}>
        <X className="h-5 w-5" aria-hidden="true" />
      </ShadcnButton>
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
