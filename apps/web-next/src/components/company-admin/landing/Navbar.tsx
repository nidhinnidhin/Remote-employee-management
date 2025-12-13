
export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-violet-600 p-1.5 rounded-lg">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                        WorkSpace
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Benefits</a>
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Stats</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-sm font-semibold text-gray-900 hover:text-gray-700">
                        Sign In
                    </button>
                    <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm shadow-violet-200">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}
