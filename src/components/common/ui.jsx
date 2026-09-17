import { Link } from "react-router-dom";
import { LoaderCircle, Search, Inbox, AlertCircle } from "lucide-react";
import { statusConfig } from "../../config/statusConfig.js";
import { pageConfig, paths } from "../../config/navigationConfig.js";
export function Button({
  children,
  variant = "primary",
  loading,
  className = "",
  to,
  ...props
}) {
  const classes = "button button-" + variant + " " + className;
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  return (
    <button
      type="button"
      className={classes}
      {...props}
      disabled={loading || props.disabled}
    >
      {loading && <LoaderCircle size={17} className="animate-spin" />}
      {children}
    </button>
  );
}
export function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, tone: "muted" };
  return (
    <span className={"badge badge-" + config.tone}>
      <i />
      {config.label}
    </span>
  );
}
export function Card({ children, title, description, action, className = "" }) {
  return (
    <section className={"card " + className}>
      {title && (
        <div className="card-heading">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function PageHeader({ page, title, description, actions }) {
  const config = pageConfig[page] || {};
  return (
    <div className="page-header">
      <div>
        <h1>{title || config.title}</h1>
        {(description || config.subtitle) && (
          <p>{description || config.subtitle}</p>
        )}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to={paths.dashboard}>{pageConfig.dashboard.title}</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span aria-hidden="true">/</span>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function SearchBar({
  value,
  onChange,
  placeholder = "Search records…",
  label = "Search records",
}) {
  return (
    <div className="search-field">
      <Search size={18} />
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange("")}>
          ×
        </button>
      )}
    </div>
  );
}
export function FilterDropdown({ label, options, value, onChange }) {
  return (
    <select
      aria-label={label}
      className="filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
export function EmptyState({
  title = "No matching records",
  description = "Try changing your search or filters.",
  action,
}) {
  return (
    <div className="state-panel">
      <Inbox size={30} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function ErrorState({ message, retry }) {
  return (
    <div role="alert" className="state-panel error-panel">
      <AlertCircle size={30} />
      <h3>We could not load this information</h3>
      <p>{message}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}
export function LoadingState({ label = "Loading workspace…" }) {
  return (
    <div className="loading-state" role="status" aria-label={label}>
      <div className="skeleton skeleton-heading" />
      <div className="stat-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="skeleton skeleton-card" key={i} />
        ))}
      </div>
      <div className="skeleton skeleton-table" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
export function InlineError({ message }) {
  return message ? (
    <p className="inline-error" role="alert">
      <AlertCircle size={17} />
      {message}
    </p>
  ) : null;
}
