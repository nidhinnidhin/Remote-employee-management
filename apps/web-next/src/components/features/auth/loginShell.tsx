import { ReactNode } from "react";
import Image from "next/image";

export default function LoginShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#8A2BE2] via-[#9C27B0] to-[#7B1FA2] bg-[length:400%_400%] animate-gradient-xy relative overflow-hidden items-center justify-center p-12">
        {/* Glassmorphism Abstract Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 transform -rotate-12 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 animate-float" />

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 mb-4">
            {/* Shield Icon Placeholder using SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Super Admin Portal
          </h1>
          <p className="text-white/80 text-lg max-w-md mx-auto">
            Manage your entire platform with powerful tools
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50/50 p-6">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="p-3 bg-purple-600 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-purple-700">{title}</h2>
              {subtitle && (
                <p className="text-gray-500 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
          {children}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">Protected by advanced security protocols</p>
          </div>
        </div>
      </div>
    </div>
  );
}
