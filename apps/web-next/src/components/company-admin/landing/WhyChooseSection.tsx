
export default function WhyChooseSection() {
    const benefits = [
        "Streamlined HR processes",
        "Real-time collaboration",
        "Secure data management",
        "Custom workflow automation",
        "Mobile-friendly interface",
        "24/7 Support access"
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 mb-24">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Join thousands of companies that trust us to manage their workforce efficiently and securely.
                    </p>
                    <div className="space-y-4">
                        {benefits.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-violet-50 rounded-xl border border-violet-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-white text-violet-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Global Access</h4>
                        <p className="text-xs text-gray-500">Work from anywhere</p>
                    </div>

                    <div className="p-6 bg-green-50 rounded-xl border border-green-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Enterprise Security</h4>
                        <p className="text-xs text-gray-500">Bank-grade encryption</p>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Save Time</h4>
                        <p className="text-xs text-gray-500">Automate workflows</p>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center">
                        <div className="w-10 h-10 rounded-full bg-white text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Top Rated</h4>
                        <p className="text-xs text-gray-500">Loved by users</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
