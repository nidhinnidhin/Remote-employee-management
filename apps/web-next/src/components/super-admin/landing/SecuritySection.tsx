export default function SecuritySection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold mb-6">Enterprise Security</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Built with Security First</h2>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Your platform deserves the highest level of protection. Our security measures ensure your data and your customers' data remain safe.
          </p>
          <ul className="space-y-4">
            {["Multi-factor authentication", "Role-based access control", "End-to-end encryption", "Regular security audits"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <div className="w-5 h-5 rounded-full border border-rose-200 flex items-center justify-center text-rose-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="grid grid-cols-2 gap-8">
            {[
              {
                l: "256-bit AES",
                s: "Encryption",
                i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              },
              {
                l: "OAuth 2.0",
                s: "Authentication",
                i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              },
              {
                l: "24/7",
                s: "Monitoring",
                i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              },
              {
                l: "99.99%",
                s: "Uptime SLA",
                i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4">
                  {item.i}
                </div>
                <div className="font-bold text-gray-900">{item.l}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
