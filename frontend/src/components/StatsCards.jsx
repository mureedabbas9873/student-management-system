export default function StatsCards({ stats }) {
  const items = [
    { label: "Total Students", value: stats.total, color: "#4f46e5" },
    { label: "Courses", value: stats.courses, color: "#0891b2" },
    { label: "Male", value: stats.male, color: "#059669" },
    { label: "Female", value: stats.female, color: "#db2777" },
  ];

  return (
    <div className="stats">
      {items.map((item) => (
        <div className="stat-card" key={item.label} style={{ borderTopColor: item.color }}>
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
