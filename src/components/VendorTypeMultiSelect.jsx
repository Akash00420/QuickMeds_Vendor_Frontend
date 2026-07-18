import { useState, useRef, useEffect } from "react";
import { VENDOR_TYPES } from "../utils/vendorTypes";

const VendorTypeMultiSelect = ({ value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleType = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeType = (val) => onChange(value.filter((v) => v !== val));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        className="form-input"
        style={{ display: "flex", flexWrap: "wrap", gap: 6, cursor: "pointer", minHeight: 44, alignItems: "center" }}
        onClick={() => setOpen((o) => !o)}
      >
        {value.length === 0 && <span className="text-muted">Select vendor type(s)</span>}
        {value.map((val) => {
          const type = VENDOR_TYPES.find((t) => t.value === val);
          return (
            <span
              key={val}
              className="badge badge-blue"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              {type?.label || val}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeType(val);
                }}
                style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700, lineHeight: 1 }}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      {open && (
        <div
          className="card"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            marginTop: 4,
            maxHeight: 220,
            overflowY: "auto",
            padding: 4,
          }}
        >
          {VENDOR_TYPES.map((t) => (
            <div
              key={t.value}
              onClick={() => toggleType(t.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                cursor: "pointer",
                borderRadius: 6,
                background: value.includes(t.value) ? "#EAF7F1" : "transparent",
              }}
            >
              <input type="checkbox" checked={value.includes(t.value)} readOnly />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorTypeMultiSelect;