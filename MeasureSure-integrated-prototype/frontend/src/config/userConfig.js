export const roles = { ADMIN: "ADMIN", INSPECTOR: "INSPECTOR" };
export const userRoles = [
  { value: roles.ADMIN, label: "Administrator" },
  { value: roles.INSPECTOR, label: "Inspector" },
];
export const userStatuses = ["ACTIVE", "INACTIVE", "PENDING"];
export const userSections = [
  {
    title: "Account details",
    fields: [
      {
        name: "name",
        label: "Full name",
        required: true,
        minLength: 2,
        placeholder: "Full legal name",
      },
      {
        name: "email",
        label: "Email address",
        type: "email",
        required: true,
        placeholder: "name@example.com",
      },
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        required: true,
        placeholder: "+91 98765 43210",
      },
      {
        name: "location",
        label: "Jurisdiction",
        required: true,
        placeholder: "City, state",
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: userRoles,
        required: true,
      },
      {
        name: "status",
        label: "Account status",
        type: "select",
        options: userStatuses.map((value) => ({
          value,
          label: value[0] + value.slice(1).toLowerCase(),
        })),
        required: true,
      },
    ],
  },
];
export const passwordField = {
  name: "password",
  label: "Password",
  type: "password",
  required: true,
  minLength: 8,
  placeholder: "At least 8 characters",
};
export const loginFields = [
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    placeholder: "name@example.com",
  },
  { ...passwordField, minLength: undefined },
];
export const registrationFields = [
  ...userSections[0].fields.filter(
    (field) => !["role", "status"].includes(field.name),
  ),
  passwordField,
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    required: true,
    matches: "password",
  },
];
export const userColumns = [
  { key: "name", label: "Team member", kind: "person" },
  { key: "email", label: "Email address" },
  { key: "role", label: "Role", kind: "role" },
  { key: "location", label: "Jurisdiction" },
  { key: "status", label: "Status", kind: "status" },
  { key: "joinedAt", label: "Joined", kind: "date" },
  { key: "actions", label: "Actions", sortable: false },
];
export const userFilters = [
  { key: "role", label: "Role", options: userRoles },
  {
    key: "status",
    label: "Status",
    options: userStatuses.map((value) => ({
      value,
      label: value[0] + value.slice(1).toLowerCase(),
    })),
  },
];
