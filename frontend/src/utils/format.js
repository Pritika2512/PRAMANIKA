import { appConfig } from "../config/appConfig.js";
export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(appConfig.locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value + "T12:00:00"))
    : "—";
export const initials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";
export const optionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || value;
export const today = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: appConfig.timezone });
