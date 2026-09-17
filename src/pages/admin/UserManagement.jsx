import { useState } from "react";
import { useQueryFilters } from "../../hooks/useQueryFilters.js";
import { getUsers, toggleUserStatus } from "../../services/userService.js";
import {
  userColumns,
  userFilters,
  userRoles,
} from "../../config/userConfig.js";
import { useResource } from "../../hooks/useResource.js";
import { useToast } from "../../hooks/useToast.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { formatDate, initials, optionLabel } from "../../utils/format.js";
import {
  PageHeader,
  Button,
  Card,
  StatusBadge,
  LoadingState,
  ErrorState,
} from "../../components/common/ui.jsx";
import { Drawer, ConfirmDialog } from "../../components/common/Modal.jsx";
import Icon from "../../components/common/Icon.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import RecordToolbar from "../../components/common/RecordToolbar.jsx";
import UserFormModal from "../../components/users/UserForm.jsx";
export default function UserManagement() {
  const { data, loading, error, reload } = useResource(getUsers);
  const { user: currentUser, refreshUser } = useAuth();
  const { params, update, clear } = useQueryFilters();
  const [editor, setEditor] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const notify = useToast();
  const search = params.get("q") || "";
  const filters = Object.fromEntries(
    userFilters.map((f) => [f.key, params.get(f.key) || ""]),
  );
  const rows = (data || []).filter(
    (row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      Object.entries(filters).every(
        ([key, value]) => !value || row[key] === value,
      ),
  );
  const viewed = data?.find((row) => row.id === viewId);
  const saved = () => {
    reload();
    refreshUser();
  };
  const columns = userColumns.map((c) =>
    c.key === "actions"
      ? {
          ...c,
          render: (row) => (
            <div className="row-actions">
              <Button
                variant="icon"
                aria-label={"View " + row.name}
                onClick={() => setViewId(row.id)}
              >
                <Icon name="Eye" size={17} />
              </Button>
              <Button
                variant="icon"
                aria-label={"Edit " + row.name}
                onClick={() => setEditor(row)}
              >
                <Icon name="Pencil" size={17} />
              </Button>
              <Button
                variant="ghost"
                disabled={row.id === currentUser.id}
                onClick={() => setConfirm(row)}
                aria-label={
                  (row.status === "ACTIVE" ? "Deactivate " : "Activate ") +
                  row.name
                }
              >
                {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ),
        }
      : c,
  );
  return (
    <>
      <PageHeader
        page="users"
        actions={
          <Button onClick={() => setEditor({})}>
            <Icon name="UserPlus" size={18} />
            Add user
          </Button>
        }
      />
      <Card>
        <RecordToolbar
          search={search}
          onSearch={(value) => update("q", value)}
          filters={userFilters}
          values={filters}
          onFilter={update}
          onClear={clear}
          placeholder="Search name, email or jurisdiction…"
        />
        {error ? (
          <ErrorState message={error} retry={reload} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <DataTable
            key={params.toString()}
            rows={rows}
            columns={columns}
            label="Users"
            onRowClick={(row) => setViewId(row.id)}
          />
        )}
      </Card>
      <UserFormModal
        open={!!editor}
        user={editor?.id ? editor : null}
        onClose={() => setEditor(null)}
        onSaved={saved}
      />
      <Drawer
        open={!!viewed}
        onClose={() => setViewId(null)}
        title="User profile"
      >
        {viewed && (
          <>
            <div className="user-profile">
              <span className="avatar large">{initials(viewed.name)}</span>
              <h2>{viewed.name}</h2>
              <p>{optionLabel(userRoles, viewed.role)}</p>
              <StatusBadge status={viewed.status} />
            </div>
            <dl className="profile-details">
              {[
                { key: "email", label: "Email address" },
                { key: "phone", label: "Phone number" },
                { key: "location", label: "Jurisdiction" },
                { key: "joinedAt", label: "Joined" },
              ].map((field) => (
                <div key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>
                    {field.key === "joinedAt"
                      ? formatDate(viewed[field.key])
                      : viewed[field.key]}
                  </dd>
                </div>
              ))}
            </dl>
            <Button
              variant="secondary"
              onClick={() => {
                setEditor(viewed);
                setViewId(null);
              }}
            >
              <Icon name="Pencil" size={17} />
              Edit user
            </Button>
          </>
        )}
      </Drawer>
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={
          confirm?.status === "ACTIVE"
            ? "Deactivate account?"
            : "Activate account?"
        }
        description={
          confirm
            ? (confirm.status === "ACTIVE" ? "Deactivating " : "Activating ") +
              confirm.name +
              (confirm.status === "ACTIVE"
                ? " will prevent this user from signing in to this demo workspace."
                : " will allow this user to sign in to this demo workspace.")
            : ""
        }
        loading={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            const updated = await toggleUserStatus(confirm.id);
            notify(
              updated.name +
                (updated.status === "ACTIVE"
                  ? " is now active."
                  : " has been deactivated."),
            );
            setConfirm(null);
            saved();
          } catch (err) {
            notify(err.message, "error");
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}
