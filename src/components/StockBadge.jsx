const StockBadge = ({ stockStatus, quantity, unit = "strips" }) => {
  const config = {
    available:    { label: "In Stock",    cls: "available", dot: "dot-green" },
    low:          { label: "Low Stock",   cls: "low",       dot: "dot-amber" },
    out_of_stock: { label: "Out of Stock",cls: "out",       dot: "dot-red"   },
  };

  const { label, cls, dot } = config[stockStatus] || config.out_of_stock;

  return (
    <span className={`stock-badge ${cls}`}>
      <span className={`stock-dot ${dot}`} />
      {label}
      {quantity !== undefined && (
        <span style={{ fontWeight: 400, marginLeft: 2 }}>· {quantity} {unit}</span>
      )}
    </span>
  );
};

export default StockBadge;