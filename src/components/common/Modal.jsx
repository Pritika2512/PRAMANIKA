import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./ui.jsx";
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  drawer = false,
  busy = false,
}) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={drawer ? "modal drawer" : "modal"}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          disabled={busy}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">{open && children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </dialog>
  );
}
export function Drawer(props) {
  return <Modal {...props} drawer />;
}
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  loading,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      busy={loading}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} onClick={onConfirm}>
            Confirm change
          </Button>
        </>
      }
    >
      <p>{description}</p>
    </Modal>
  );
}
