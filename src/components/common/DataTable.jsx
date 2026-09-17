import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { appConfig } from "../../config/appConfig.js";
import { instrumentTypes } from "../../config/instrumentConfig.js";
import { userRoles } from "../../config/userConfig.js";
import { instrumentPath } from "../../config/navigationConfig.js";
import { formatDate, initials, optionLabel } from "../../utils/format.js";
import { EmptyState, StatusBadge } from "./ui.jsx";
function Cell({ column, row }) {
  const value = row[column.key];
  if (column.render) return column.render(row);
  if (column.kind === "status") return <StatusBadge status={value} />;
  if (column.kind === "date") return formatDate(value);
  if (column.kind === "instrumentLink")
    return (
      <Link
        className="record-link"
        onClick={(e) => e.stopPropagation()}
        to={instrumentPath(value)}
      >
        {value}
      </Link>
    );
  if (column.kind === "instrumentType")
    return (
      <div className="cell-stack">
        <strong>{optionLabel(instrumentTypes, value)}</strong>
        <small>{row.model}</small>
      </div>
    );
  if (column.kind === "role") return optionLabel(userRoles, value);
  if (column.kind === "person")
    return (
      <div className="person-cell">
        <span className="avatar">{initials(value)}</span>
        <strong>{value}</strong>
      </div>
    );
  return value ?? "—";
}
export default function DataTable({
  columns,
  rows,
  onRowClick,
  pageSize = appConfig.pageSize,
  label = "Records",
  emptyAction,
}) {
  const [sort, setSort] = useState({ key: "", direction: 1 });
  const [page, setPage] = useState(1);
  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        sort.key
          ? String(a[sort.key] ?? "").localeCompare(
              String(b[sort.key] ?? ""),
              undefined,
              { numeric: true },
            ) * sort.direction
          : 0,
      ),
    [rows, sort],
  );
  const count = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, count);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);
  if (!rows.length) return <EmptyState action={emptyAction} />;
  return (
    <>
      <div className="table-scroll">
        <table aria-label={label}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  aria-sort={
                    sort.key === column.key
                      ? sort.direction === 1
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {column.sortable === false ? (
                    column.label
                  ) : (
                    <button
                      onClick={() => {
                        setSort({
                          key: column.key,
                          direction:
                            sort.key === column.key ? -sort.direction : 1,
                        });
                        setPage(1);
                      }}
                      aria-label={"Sort by " + column.label}
                    >
                      {column.label}
                      <ArrowUpDown size={13} />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.id}
                className={onRowClick ? "clickable-row" : ""}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-label={column.label}
                    onClick={
                      column.key === "actions"
                        ? (e) => e.stopPropagation()
                        : undefined
                    }
                  >
                    <Cell column={column} row={row} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>
          {(current - 1) * pageSize + 1}–
          {Math.min(current * pageSize, rows.length)} of {rows.length} records
        </span>
        <div>
          <button
            className="icon-button"
            aria-label="Previous page"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={17} />
          </button>
          <span>
            Page {current} of {count}
          </span>
          <button
            className="icon-button"
            aria-label="Next page"
            disabled={current === count}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
