
export default function HeroSection() {
    return (
        <section className="text-center px-4 max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold uppercase tracking-wide mb-6">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                Powerful Workspace Management
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Manage Your <span className="text-violet-600">Workforce</span> <br />
                Efficiently
            </h1>

            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Streamline your company operations with our all-in-one workspace management platform.
                From employee management to project tracking, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 transition-all flex items-center gap-2">
                    Start Free Trial
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <button className="px-8 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all">
                    Watch Demo
                </button>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative mx-auto max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden p-2">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    <div className="mx-auto text-[10px] text-gray-400 font-medium">workspace-dashboard.app</div>
                </div>
                <div className="pt-10 pb-6 px-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Mock Card 1 */}
                        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Employees</div>
                                <div className="text-2xl font-bold text-gray-900">1,234</div>
                            </div>
                            <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                        </div>
                        {/* Mock Card 2 */}
                        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Active Projects</div>
                                <div className="text-2xl font-bold text-gray-900">48</div>
                            </div>
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" ry="2" /><path d="M9 14h6" /><path d="M9 18h6" /><path d="M9 10h6" /></svg>
                            </div>
                        </div>
                        {/* Mock Card 3 */}
                        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tasks Completed</div>
                                <div className="text-2xl font-bold text-gray-900">2,847</div>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
