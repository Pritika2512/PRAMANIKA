import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  validateField,
  validateFields,
  passwordStrength,
} from "../../utils/validation.js";
import { Button, InlineError } from "./ui.jsx";
import Icon from "./Icon.jsx";

export function FormInput({ label, error, ...props }) {
  const id = useId();
  return (
    <label className="form-field" htmlFor={id}>
      <span>
        {label}
        {props.required && <b aria-hidden="true"> *</b>}
      </span>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? id + "-error" : undefined}
        {...props}
      />
      {error && (
        <small className="field-error" id={id + "-error"}>
          {error}
        </small>
      )}
    </label>
  );
}
export function FormSelect({ label, options, error, ...props }) {
  const id = useId();
  return (
    <label className="form-field" htmlFor={id}>
      <span>
        {label}
        {props.required && <b aria-hidden="true"> *</b>}
      </span>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? id + "-error" : undefined}
        {...props}
      >
        <option value="">Choose an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <small className="field-error" id={id + "-error"}>
          {error}
        </small>
      )}
    </label>
  );
}
export const FormPhoneInput = (props) => (
  <FormInput {...props} type="tel" autoComplete="tel" />
);
export function FormPasswordInput({ label, error, value, strength, ...props }) {
  const [show, setShow] = useState(false);
  const id = useId();
  const result = passwordStrength(value);
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {props.required && <b aria-hidden="true"> *</b>}
      </label>
      <div className="password-input">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? id + "-error" : undefined}
          {...props}
        />
        <button
          type="button"
          aria-label={(show ? "Hide " : "Show ") + label.toLowerCase()}
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <small className="field-error" id={id + "-error"}>
          {error}
        </small>
      )}
      {strength && value && (
        <div className="password-strength">
          <div>
            {[1, 2, 3, 4].map((n) => (
              <i key={n} className={n <= result.score ? "filled" : ""} />
            ))}
          </div>
          <small>Password strength: {result.label}</small>
        </div>
      )}
    </div>
  );
}
export function FormSection({ title, description, icon, children }) {
  return (
    <section className="form-section">
      {title && (
        <div className="section-heading">
          {icon && (
            <span className="section-icon">
              <Icon name={icon} />
            </span>
          )}
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
        </div>
      )}
      <div className="form-grid">{children}</div>
    </section>
  );
}
export function FormActions({
  onCancel,
  loading,
  submitLabel = "Save changes",
}) {
  return (
    <div className="form-actions">
      {onCancel && (
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      )}
      <Button type="submit" loading={loading}>
        {submitLabel}
      </Button>
    </div>
  );
}
export function ConfigForm({
  sections,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel,
  passwordMeter = false,
  compact = false,
}) {
  const fields = sections.flatMap((section) => section.fields);
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      fields.map((field) => [field.name, initialValues[field.name] ?? ""]),
    ),
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  function change(field, value) {
    const next = { ...values, [field.name]: value };
    setValues(next);
    setErrors((previous) => ({
      ...previous,
      [field.name]: validateField(field, value, next),
      ...(field.name === "password" && next.confirmPassword
        ? {
            confirmPassword: validateField(
              fields.find((f) => f.name === "confirmPassword") || {},
              next.confirmPassword,
              next,
            ),
          }
        : {}),
    }));
  }
  async function submit(event) {
    event.preventDefault();
    const next = validateFields(fields, values);
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      noValidate
      onSubmit={submit}
      className={"config-form " + (compact ? "compact-form" : "")}
    >
      <InlineError message={serverError} />
      <fieldset disabled={loading}>
        {sections.map((section, index) => (
          <FormSection key={index} {...section}>
            {section.fields.map((field) => {
              const common = {
                label: field.label,
                required: field.required,
                placeholder: field.placeholder,
                value: values[field.name],
                error: errors[field.name],
                onChange: (event) => change(field, event.target.value),
                onBlur: () =>
                  setErrors((previous) => ({
                    ...previous,
                    [field.name]: validateField(
                      field,
                      values[field.name],
                      values,
                    ),
                  })),
              };
              let control;
              if (field.type === "select")
                control = <FormSelect {...common} options={field.options} />;
              else if (field.type === "password")
                control = (
                  <FormPasswordInput
                    {...common}
                    strength={passwordMeter && field.name === "password"}
                    autoComplete={
                      passwordMeter ? "new-password" : "current-password"
                    }
                  />
                );
              else if (field.type === "tel")
                control = <FormPhoneInput {...common} />;
              else if (field.type === "textarea")
                control = (
                  <label className="form-field">
                    <span>
                      {field.label}
                      {field.required && <b> *</b>}
                    </span>
                    <textarea
                      rows={3}
                      value={common.value}
                      onChange={common.onChange}
                      onBlur={common.onBlur}
                      placeholder={field.placeholder}
                      aria-invalid={!!common.error}
                    />
                    {common.error && (
                      <small className="field-error">{common.error}</small>
                    )}
                  </label>
                );
              else
                control = (
                  <FormInput
                    {...common}
                    type={field.type || "text"}
                    autoComplete={field.type === "email" ? "email" : undefined}
                  />
                );
              return (
                <div
                  className={field.wide ? "field-wide" : ""}
                  key={field.name}
                >
                  {control}
                </div>
              );
            })}
          </FormSection>
        ))}
      </fieldset>
      <FormActions
        onCancel={onCancel}
        loading={loading}
        submitLabel={submitLabel}
      />
    </form>
  );
}
