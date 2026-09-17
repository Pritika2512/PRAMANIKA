import { appConfig } from "../config/appConfig.js";
import { registrationFields } from "../config/userConfig.js";
import { validateFields } from "../utils/validation.js";
import { copy, nextId, recordActivity, store, wait } from "./mockStore.js";

let currentId = null;
try {
  currentId = sessionStorage.getItem(appConfig.storageKey);
} catch {
  /* Memory-only sessions still work. */
}
const publicUser = (user) => {
  if (!user) return null;
  const result = copy(user);
  delete result.password;
  return result;
};
export function getCurrentUser() {
  const user = store.users.find(
    (item) => item.id === currentId && item.status === "ACTIVE",
  );
  return publicUser(user);
}
export async function login({ email, password }) {
  await wait();
  const user = store.users.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );
  if (!user) throw new Error("Email or password is incorrect.");
  if (user.status !== "ACTIVE")
    throw new Error(
      "This account is " +
        user.status.toLowerCase() +
        ". Please contact an administrator.",
    );
  currentId = user.id;
  try {
    sessionStorage.setItem(appConfig.storageKey, currentId);
  } catch {
    /* Session remains available in memory. */
  }
  return publicUser(user);
}
export async function register(values) {
  await wait();
  const errors = validateFields(registrationFields, values);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  if (
    store.users.some(
      (user) => user.email.toLowerCase() === values.email.trim().toLowerCase(),
    )
  )
    throw new Error("An account with this email already exists.");
  const { confirmPassword: _confirm, ...data } = values;
  void _confirm;
  const user = {
    ...data,
    email: data.email.trim().toLowerCase(),
    id: nextId(store.users, "USR-"),
    role: appConfig.registrationRole,
    status: "ACTIVE",
    joinedAt: today(),
  };
  store.users.push(user);
  recordActivity("Account registered", user.name, user.name);
  return publicUser(user);
}
export function logout() {
  currentId = null;
  try {
    sessionStorage.removeItem(appConfig.storageKey);
  } catch {
    /* Nothing to clear. */
  }
}
export function requireUser() {
  const user = getCurrentUser();
  if (!user) throw new Error("Sign in to continue.");
  return user;
}
import { today } from "../utils/format.js";
