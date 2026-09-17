import { SearchBar, FilterDropdown, Button } from "./ui.jsx";
export default function RecordToolbar({
  search,
  onSearch,
  filters,
  values,
  onFilter,
  placeholder,
  extraActive,
  onClear,
}) {
  const active = search || extraActive || Object.values(values).some(Boolean);
  return (
    <div className="record-toolbar">
      <SearchBar value={search} onChange={onSearch} placeholder={placeholder} />
      <div className="filter-group">
        {filters.map(({ key, ...filter }) => (
          <FilterDropdown
            key={key}
            {...filter}
            value={values[key] || ""}
            onChange={(value) => onFilter(key, value)}
          />
        ))}
        {active && (
          <Button variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
