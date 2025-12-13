
export default function StatsSection() {
    return (
        <section className="border-y border-gray-100 bg-white mb-24">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100/50">
                <div>
                    <div className="text-4xl font-bold text-violet-600 mb-1">10K+</div>
                    <div className="text-sm font-medium text-gray-500">Active Companies</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-violet-400 mb-1">500K+</div>
                    <div className="text-sm font-medium text-gray-500">Employees Managed</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-violet-500 mb-1">99.9%</div>
                    <div className="text-sm font-medium text-gray-500">Uptime</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-violet-600 mb-1">4.9/5</div>
                    <div className="text-sm font-medium text-gray-500">User Rating</div>
                </div>
            </div>
        </section>
    );
}
