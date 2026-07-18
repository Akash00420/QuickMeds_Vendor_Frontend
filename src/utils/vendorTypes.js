export const VENDOR_TYPES = [
  { value: "medicine",             label: "Medicine Vendor" },
  { value: "blood_bank",           label: "Blood Bank Vendor" },
  { value: "oxygen",               label: "Oxygen Vendor" },
  { value: "medical_equipment",    label: "Medical Equipment Vendor" },
  { value: "surgical_consumables", label: "Surgical & Consumables Vendor" },
  { value: "laboratory",           label: "Laboratory Vendor" },
];

export const vendorTypeLabel = (value) =>
  VENDOR_TYPES.find((t) => t.value === value)?.label || value;

export const vendorTypeLabels = (values = []) =>
  values.map((v) => vendorTypeLabel(v)).join(", ");