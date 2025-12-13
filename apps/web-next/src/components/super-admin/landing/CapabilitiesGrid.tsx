export default function CapabilitiesGrid() {
  const caps = [
    {
      t: "Real-time Monitoring",
      d: "Monitor platform health and performance in real-time",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    },
    {
      t: "Data Management",
      d: "Secure backup, recovery, and data governance tools.",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    },
    {
      t: "Infrastructure Control",
      d: "Manage servers, deployments, and system resources.",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    },
    {
      t: "Security Center",
      d: "Advanced security controls and threat detection",
      svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Advanced Platform Capabilities
          </h2>
          <p className="text-gray-500">Enterprise-grade tools for complete platform governance and control.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {caps.map((cap, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 mx-auto bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{cap.svg}</svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{cap.t}</h4>
              <p className="text-sm text-gray-500">{cap.d}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
