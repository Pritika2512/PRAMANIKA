import { ConfigForm } from "../common/Forms.jsx";
import { Modal } from "../common/Modal.jsx";
import { userSections, passwordField, roles } from "../../config/userConfig.js";
import { createUser, updateUser } from "../../services/userService.js";
import { useToast } from "../../hooks/useToast.jsx";
export default function UserFormModal({ open, user, onClose, onSaved }) {
  const notify = useToast();
  const sections = user
    ? userSections
    : [
        ...userSections,
        { title: "Sign-in credentials", fields: [passwordField] },
      ];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? "Edit user" : "Add user"}
    >
      <ConfigForm
        key={user?.id || "new"}
        compact
        sections={sections}
        initialValues={user || { role: roles.INSPECTOR, status: "ACTIVE" }}
        passwordMeter
        onCancel={onClose}
        submitLabel={user ? "Save changes" : "Add user"}
        onSubmit={async (values) => {
          if (user) await updateUser(user.id, values);
          else await createUser(values);
          notify(
            user ? "User updated successfully." : "User added successfully.",
          );
          onClose();
          onSaved();
        }}
      />
    </Modal>
  );
}
