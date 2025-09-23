import PropTypes from "prop-types";
import { Fragment, memo } from "react";

import { Button as ShadcnButton } from "./ui/button";
import Modal from "./modal";

const Confirmation = (props) => {
  const {
    isOpen,
    title = "Confirmation",
    onCancel,
    onConfirm,
    children,
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
  } = props;

  return (
    <Modal
      key="react-modal"
      className="modal modal-centered"
      isOpen={isOpen}
      contentlabel={title}
      onRequestClose={onCancel}
    >
      <Fragment>
        <div
          className=""
          tabIndex={-1}
        >
          <div className="px-6 py-4 text-sm">
            {children}
          </div>
          <div className="flex items-center justify-end gap-2 px-6 py-4">
            <ShadcnButton variant="outline" onClick={onCancel}>
              {cancelLabel}
            </ShadcnButton>
            <ShadcnButton autoFocus onClick={onConfirm}>
              {confirmLabel}
            </ShadcnButton>
          </div>
        </div>
      </Fragment>
    </Modal>
  );
};

Confirmation.propTypes = {
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  isOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default memo(Confirmation);
