
export default function FeaturesGrid() {
    const features = [
        {
            title: "Employee Management",
            desc: "Manage your entire workforce with comprehensive employee profiles, departments, and teams.",
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            borderColor: "hover:border-violet-100",
            svg: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        },
        {
            title: "Task & Project Tracking",
            desc: "Assign, track, and manage tasks and projects with real-time progress monitoring.",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500",
            borderColor: "hover:border-orange-100",
            svg: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        },
        {
            title: "Attendance & Leave",
            desc: "Track attendance, manage leave requests, and maintain accurate work hour records.",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "hover:border-blue-100",
            svg: <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        },
        {
            title: "Team Discussions",
            desc: "Foster collaboration with built-in discussion forums and announcement boards.",
            iconBg: "bg-pink-50",
            iconColor: "text-pink-500",
            borderColor: "hover:border-pink-100",
            svg: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        },
        {
            title: "Company Policies",
            desc: "Centralize and distribute company policies, ensuring everyone stays informed.",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "hover:border-purple-100",
            svg: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        },
        {
            title: "Analytics & Reports",
            desc: "Gain insights with comprehensive analytics and customizable reports.",
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
            borderColor: "hover:border-indigo-100",
            svg: <line x1="18" y1="20" x2="18" y2="10" />
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 mb-24">
            <div className="text-center mb-16 px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Manage Your Workspace</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Comprehensive tools designed to streamline your company operations and boost productivity.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-violet-100 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Employee Management</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Manage your entire workforce with comprehensive employee profiles, departments, and teams.</p>
                </div>

                {/* Feature 2 */}
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-orange-100 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" ry="2" /><path d="M9 14h6" /><path d="M9 18h6" /><path d="M9 10h6" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Task & Project Tracking</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Assign, track, and manage tasks and projects with real-time progress monitoring.</p>
                </div>

                {/* Feature 3 */}
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Attendance & Leave</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Track attendance, manage leave requests, and maintain accurate work hour records.</p>
                </div>

                {/* Feature 4 */}
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-pink-100 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Team Discussions</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Foster collaboration with built-in discussion forums and announcement boards.</p>
                </div>

                {/* Feature 5 */}
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-purple-100 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Company Policies</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Centralize and distribute company policies, ensuring everyone stays informed.</p>
                </div>

                {/* Feature 6 */}
                <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Analytics & Reports</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Gain insights with comprehensive analytics and customizable reports.</p>
                </div>
            </div>
        </section>
    );
}
