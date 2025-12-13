"use client";

export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex w-[40%] bg-blue-600 relative overflow-hidden items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700" />

      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse mix-blend-overlay" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse mix-blend-color-dodge"
        style={{ animationDuration: "4s" }}
      />

      {/* Content */}
      <div className="relative z-10 p-12 max-w-lg text-center">
        <div className="inline-block mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 mx-auto">
            {/* Logo SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Manage your team <br />
          <span className="text-blue-200">from anywhere.</span>
        </h1>

        <p className="text-blue-100/80 text-lg max-w-md mx-auto">
          Secure, efficient, and powerful tools to help your remote organization thrive.
        </p>
      </div>

      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
