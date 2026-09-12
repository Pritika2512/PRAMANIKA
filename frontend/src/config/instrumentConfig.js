export const instrumentTypes = [
  { value: "WEIGHING_MACHINE", label: "Weighing machine" },
  { value: "WEIGHING_SCALE", label: "Weighing scale" },
  { value: "MEASURING_METER", label: "Measuring meter" },
  { value: "LENGTH_MEASURING", label: "Length measure" },
  { value: "VOLUME_MEASURING", label: "Volume measure" },
  { value: "OTHER", label: "Other instrument" },
];
export const instrumentStatuses = ["VERIFIED", "PENDING", "EXPIRED", "FAILED"];
export const instrumentSections = [
  {
    title: "Instrument specifications",
    description: "Use the information printed on the instrument nameplate.",
    icon: "Scale",
    fields: [
      {
        name: "type",
        label: "Instrument type",
        type: "select",
        options: instrumentTypes,
        required: true,
      },
      {
        name: "manufacturer",
        label: "Manufacturer",
        required: true,
        placeholder: "e.g. Essae-Teraoka",
      },
      {
        name: "model",
        label: "Model",
        required: true,
        placeholder: "e.g. DS-252",
      },
      {
        name: "serialNumber",
        label: "Serial number",
        required: true,
        placeholder: "Unique manufacturer serial number",
      },
      {
        name: "capacity",
        label: "Capacity",
        required: true,
        placeholder: "e.g. 30 kg",
      },
      {
        name: "accuracy",
        label: "Accuracy / least count",
        required: true,
        placeholder: "e.g. 5 g",
      },
    ],
  },
  {
    title: "Registered owner",
    description: "Identify the establishment responsible for this instrument.",
    icon: "Building2",
    fields: [
      {
        name: "owner",
        label: "Owner / establishment",
        required: true,
        placeholder: "Registered establishment name",
      },
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        required: true,
        placeholder: "+91 98765 43210",
      },
      {
        name: "location",
        label: "City and state",
        required: true,
        placeholder: "Pune, Maharashtra",
      },
      {
        name: "address",
        label: "Complete address",
        type: "textarea",
        required: true,
        wide: true,
        placeholder: "Street, locality, city, state and PIN code",
      },
    ],
  },
];
export const instrumentColumns = [
  { key: "id", label: "Instrument ID", kind: "instrumentLink" },
  { key: "type", label: "Instrument", kind: "instrumentType" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "serialNumber", label: "Serial number" },
  { key: "owner", label: "Registered owner" },
  { key: "status", label: "Status", kind: "status" },
  { key: "createdAt", label: "Registered", kind: "date" },
  { key: "actions", label: "Actions", sortable: false },
];
export const instrumentFilters = [
  {
    key: "status",
    label: "Status",
    options: instrumentStatuses.map((value) => ({
      value,
      label: value[0] + value.slice(1).toLowerCase(),
    })),
  },
  { key: "type", label: "Instrument type", options: instrumentTypes },
];
