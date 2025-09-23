import { useCallback, useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import { usePrevious } from "web-common/hooks";
import { getScrollbarWidth, omit } from "web-common/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Preserve original scrollbar padding behavior to avoid layout shift
let initialPadding = parseFloat(document.body.style.paddingRight);
initialPadding = Number.isNaN(initialPadding) ? 0 : initialPadding;

const setScrollbar = () => {
  const calculatedPadding = initialPadding + getScrollbarWidth();
  document.body.style.paddingRight = `${calculatedPadding}px`;
};

const resetScrollbar = () => {
  document.body.style.paddingRight = `${initialPadding}px`;
};

/**
 * Modal (shadcn Dialog-backed)
 *
 * Props compatibility notes (from previous ReactModal usage):
 * - isOpen: controlled open state → mapped to Dialog `open`
 * - onAfterOpen(ref): called after the dialog mounts/focuses (passed a ref to content)
 * - onRequestClose(): called when the dialog requests to close (overlay/esc)
 * - className: applied to DialogContent (keeps "modal-body" by default)
 * - overlayClassName, parentSelector, appElement, style: no longer applicable (omitted)
 */
const Modal = (props) => {
  const {
    isOpen,
    onAfterOpen = null,
    onRequestClose,
    className,
    children,
    contentlabel,
    ...rest
  } = props;

  const contentRef = useRef(null);
  const wasOpen = usePrevious(isOpen);

  const handleOpenChange = useCallback(
    (open) => {
      // When Dialog requests close, mirror ReactModal's onRequestClose
      if (!open && typeof onRequestClose === "function") {
        onRequestClose();
      }
    },
    [onRequestClose],
  );

  const handleOpenAutoFocus = useCallback(
    (event) => {
      // Allow Radix to manage focus; we don't call preventDefault()
      // Remove legacy maxHeight/overflow hack used to prevent scroll on focus
      if (contentRef.current) {
        contentRef.current.style.maxHeight = null;
        contentRef.current.style.overflowY = null;
      }
      if (onAfterOpen) {
        onAfterOpen(contentRef);
      }
    },
    [onAfterOpen],
  );

  useEffect(() => {
    if (isOpen && !wasOpen) {
      setScrollbar();
    } else if (wasOpen && !isOpen) {
      resetScrollbar();
    }
  }, [isOpen, wasOpen]);

  useEffect(() => {
    return resetScrollbar;
  }, []);

  // Combine legacy "modal-body" with any incoming className
  const contentClass = ["modal-body", className].filter(Boolean).join(" ");

  // Omit ReactModal-specific props if they leak in
  const contentProps = omit(rest, [
    "overlayClassName",
    "parentSelector",
    "appElement",
    "style",
    "role",
  ]);

  return (
    <Dialog open={!!isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={contentRef}
        className={contentClass}
        onOpenAutoFocus={handleOpenAutoFocus}
        {...contentProps}
      >
        <DialogHeader>
          <DialogTitle>{contentlabel}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onAfterOpen: PropTypes.func,
  onRequestClose: PropTypes.func,
  className: PropTypes.string,
  contentlabel: PropTypes.string,
  children: PropTypes.node,
};

export default memo(Modal);
