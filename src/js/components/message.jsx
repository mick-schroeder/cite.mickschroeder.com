import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import {
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import { Button as ShadcnButton } from "./ui/button";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

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
           <div className="flex justify-center items-center w-full">
 <Alert
      aria-live="polite"
      aria-labelledby={htmlID}
      role="status"
      className="max-w-xl w-full"
      variant={category === "warning" || category === "error" ? "destructive" : "default"}
    >
      {/* Dismiss */}
      <ShadcnButton
        title="Dismiss"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1 text-muted-foreground hover:text-foreground"
        onClick={handleDismiss}
        aria-label="Dismiss message"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </ShadcnButton>
      

      
          {
            {
              info: <Info className="h-10 w-10 shrink-0" aria-hidden="true" />,
              success: <CheckCircle2 className="h-10 w-10 shrink-0" aria-hidden="true" />,
              warning: <AlertTriangle className="h-10 w-10 shrink-0" aria-hidden="true" />,
              error: <AlertOctagon className="h-10 w-10 shrink-0" aria-hidden="true" />,
            }[category]
          }
            <AlertTitle  className="text-md">
              {{
                info: "Information",
                success: "Success",
                warning: "Warning",
                error: "Error",
              }[category]}
            </AlertTitle>
            <AlertDescription id={htmlID} className="text-md flex items-center ">
             
             <div>              {message}
</div>
      <div>{action &&
          (href ? (
            <ShadcnButton
              asChild
              size="sm"
              variant="outline"
              className="ml-4 shrink-0 self-start sm:self-center"
            >
              <a href={href}>{action}</a>
            </ShadcnButton>
          ) : (
            <ShadcnButton
              variant="outline"
              size="sm"
              onClick={handleAction}
              className="ml-4 shrink-0 self-start sm:self-center"
            >
              {action}
            </ShadcnButton>
          ))}</div>
       

        
                 </AlertDescription>

    </Alert>
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
