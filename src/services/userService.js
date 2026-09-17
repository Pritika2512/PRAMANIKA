import { roles, userSections, passwordField } from "../config/userConfig.js";
import { validateFields } from "../utils/validation.js";
import { getCurrentUser, requireUser } from "./authService.js";
import { copy, nextId, recordActivity, store, wait } from "./mockStore.js";
function requireAdmin() {
  const actor = requireUser();
  if (actor.role !== roles.ADMIN)
    throw new Error("Administrator access is required.");
  return actor;
}
function safe(user) {
  const result = copy(user);
  delete result.password;
  return result;
}
export async function getUsers() {
  await wait();
  requireAdmin();
  return store.users.map(safe);
}
function check(values, id) {
  const fields = userSections.flatMap((section) => section.fields);
  const errors = validateFields(
    id ? fields : [...fields, passwordField],
    values,
  );
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  if (
    store.users.some(
      (user) =>
        user.id !== id &&
        user.email.toLowerCase() === values.email.trim().toLowerCase(),
    )
  )
    throw new Error("An account with this email already exists.");
}
export async function createUser(values) {
  await wait();
  const actor = requireAdmin();
  check(values);
  const user = {
    ...values,
    email: values.email.trim().toLowerCase(),
    id: nextId(store.users, "USR-"),
    joinedAt: today(),
  };
  store.users.push(user);
  recordActivity("Account added", user.name, actor.name);
  return safe(user);
}
export async function updateUser(id, values) {
  await wait();
  const actor = requireAdmin();
  check(values, id);
  const index = store.users.findIndex((user) => user.id === id);
  if (index < 0) throw new Error("User not found.");
  if (
    actor.id === id &&
    (values.role !== roles.ADMIN || values.status !== "ACTIVE")
  )
    throw new Error("You cannot remove your own administrator access.");
  const allowed = Object.fromEntries(
    userSections
      .flatMap((s) => s.fields)
      .map((field) => [field.name, values[field.name]]),
  );
  store.users[index] = {
    ...store.users[index],
    ...allowed,
    email: values.email.trim().toLowerCase(),
  };
  recordActivity("Account updated", values.name, actor.name);
  return safe(store.users[index]);
}
export async function toggleUserStatus(id) {
  await wait();
  const actor = requireAdmin();
  const user = store.users.find((item) => item.id === id);
  if (!user) throw new Error("User not found.");
  if (id === getCurrentUser().id)
    throw new Error("You cannot deactivate your own account.");
  user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  recordActivity(
    user.status === "ACTIVE" ? "Account activated" : "Account deactivated",
    user.name,
    actor.name,
  );
  return safe(user);
}
import { today } from "../utils/format.js";
