export function validateField(field, value, values = {}) {
  const text = String(value ?? "").trim();
  if (field.required && !text) return field.label + " is required.";
  if (!text) return "";
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
    return "Enter a valid email address.";
  if (
    field.type === "tel" &&
    !/^(?:\+91)?[6-9]\d{9}$/.test(text.replace(/[\s()-]/g, ""))
  )
    return "Enter a valid 10-digit Indian mobile number.";
  if (field.minLength && text.length < field.minLength)
    return "Use at least " + field.minLength + " characters.";
  if (field.matches && value !== values[field.matches])
    return "Passwords do not match.";
  if (field.options && !field.options.some((option) => option.value === value))
    return "Choose a valid option.";
  return "";
}
export function validateFields(fields, values) {
  return Object.fromEntries(
    fields
      .map((field) => [
        field.name,
        validateField(field, values[field.name], values),
      ])
      .filter(([, error]) => error),
  );
}
export function passwordStrength(value = "") {
  const score = [
    value.length >= 8,
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;
  return {
    score,
    label: ["Not entered", "Weak", "Fair", "Good", "Strong"][score],
  };
}
