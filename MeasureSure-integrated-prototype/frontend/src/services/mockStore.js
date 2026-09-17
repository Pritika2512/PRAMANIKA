import { appConfig } from "../config/appConfig.js";
import { mockUsers } from "../data/mockUsers.js";
import { mockInstruments } from "../data/mockInstruments.js";
import { mockActivities } from "../data/mockActivities.js";
import { mockInspections } from "../data/mockInspections.js";
import { mockCertificates } from "../data/mockCertificates.js";

// All mutations live behind services. Changes last until the page is reloaded.
// This is intentionally an in-memory frontend demo, with no database.
export const store = structuredClone({
  users: mockUsers,
  instruments: mockInstruments,
  activities: mockActivities,
  inspections: mockInspections,
  certificates: mockCertificates,
});
export const wait = () =>
  new Promise((resolve) => setTimeout(resolve, appConfig.serviceDelay));
export const copy = (data) => structuredClone(data);
export function recordActivity(action, target, actor) {
  store.activities.unshift({
    id: crypto.randomUUID(),
    action,
    target,
    actor: actor || "Workspace user",
    date: today(),
  });
}
export function nextId(records, prefix, width = 3) {
  const max = Math.max(
    0,
    ...records.map((item) => Number(item.id.split("-").at(-1)) || 0),
  );
  return prefix + String(max + 1).padStart(width, "0");
}
import { today } from "../utils/format.js";
