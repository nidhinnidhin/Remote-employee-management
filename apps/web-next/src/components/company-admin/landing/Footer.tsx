
export default function Footer() {
    return (
        <footer className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-violet-600 rounded-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </div>
                    <span className="text-sm font-bold text-gray-900">WorkSpace</span>
                </div>
                <div className="text-xs text-gray-400">
                    © 2024 WorkSpace. All rights reserved.
                </div>
                <div className="flex gap-6 text-xs text-gray-400">
                    <a href="#" className="hover:text-gray-900">Privacy</a>
                    <a href="#" className="hover:text-gray-900">Terms</a>
                    <a href="#" className="hover:text-gray-900">Contact</a>
                </div>
            </div>
        </footer>
    );
}
