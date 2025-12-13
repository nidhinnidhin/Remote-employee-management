export default function StatsBar() {
  const stats = [
    { label: "Companies", value: "500+", c: "text-rose-600" },
    { label: "Total Users", value: "50K+", c: "text-purple-600" },
    { label: "Revenue Managed", value: "$2M+", c: "text-rose-600" },
    { label: "Uptime", value: "99.99%", c: "text-purple-600" },
  ];

  return (
    <section className="py-20 bg-gray-50" id="stats">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="space-y-2">
            <h3 className={`text-4xl md:text-5xl font-bold ${stat.c}`}>{stat.value}</h3>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
