export default function StatsGrid() {
    const stats = [
        { label: "Total Companies", value: "156", change: "+12%", isPositive: true },
        { label: "Active", value: "142", change: "+8%", isPositive: true },
        { label: "Suspended", value: "14", change: "-3%", isPositive: false },
        { label: "Total MRR", value: "$45.2K", change: "+18%", isPositive: true },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 font-medium mb-2">{stat.label}</div>
                    <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className={`text-sm font-bold ${stat.isPositive ? "text-green-500" : "text-green-500"}`}>
                            {stat.change}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
