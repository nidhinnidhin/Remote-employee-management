export default function FeaturesGrid() {
  const features = [
    {
      t: "Company Management",
      d: "Oversee all registered companies, manage subscriptions, and monitor activity across the platform.",
      i: "bg-rose-100 text-rose-600",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    },
    {
      t: "User Administration",
      d: "Manage user accounts, permissions, and access controls across all organizations.",
      i: "bg-rose-100 text-rose-600",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    },
    {
      t: "Billing & Subscriptions",
      d: "Handle billing, invoicing, and subscription management for all clients.",
      i: "bg-rose-100 text-rose-600",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    },
    {
      t: "Platform Analytics",
      d: "Access comprehensive analytics and insights across the entire platform.",
      i: "bg-rose-100 text-rose-600",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    },
    {
      t: "Support Management",
      d: "Handle support tickets, resolve issues, and maintain client satisfaction.",
      i: "bg-rose-100 text-rose-600",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    },
    {
      t: "Audit Logs",
      d: "Track all system activities with detailed audit logs and compliance reports.",
      i: "bg-rose-100 text-rose-600",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Admin Features
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to manage and monitor your entire platform from a single dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.i}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.svg}</svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.t}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.d}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
