import { instrumentSections } from "../config/instrumentConfig.js";
import { validateFields } from "../utils/validation.js";
import { copy, nextId, recordActivity, store, wait } from "./mockStore.js";
import { requireUser } from "./authService.js";

export async function getInstruments() {
  await wait();
  requireUser();
  return copy(store.instruments);
}
export async function getInstrumentById(id) {
  await wait();
  requireUser();
  return copy(store.instruments.find((item) => item.id === id) || null);
}
function check(values, id) {
  const errors = validateFields(
    instrumentSections.flatMap((section) => section.fields),
    values,
  );
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  if (
    store.instruments.some(
      (item) =>
        item.id !== id &&
        item.serialNumber.toLowerCase() ===
          values.serialNumber.trim().toLowerCase(),
    )
  )
    throw new Error("This serial number is already registered.");
}
export async function createInstrument(values) {
  await wait();
  const actor = requireUser();
  check(values);
  const instrument = {
    ...values,
    id: nextId(store.instruments, "INS-2026-", 5),
    status: "PENDING",
    createdAt: today(),
  };
  store.instruments.unshift(instrument);
  recordActivity("Instrument registered", instrument.id, actor.name);
  return copy(instrument);
}
export async function updateInstrument(id, values) {
  await wait();
  const actor = requireUser();
  check(values, id);
  const index = store.instruments.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Instrument not found.");
  const original = store.instruments[index];
  const allowed = Object.fromEntries(
    instrumentSections
      .flatMap((s) => s.fields)
      .map((field) => [field.name, values[field.name]]),
  );
  store.instruments[index] = { ...original, ...allowed };
  recordActivity("Instrument updated", id, actor.name);
  return copy(store.instruments[index]);
}
import { today } from "../utils/format.js";
