import React, { useState } from "react";
import { Eye, EyeOff, Lock, Building, Mail } from "lucide-react";
import Link from "next/link";

interface LoginFormProps {
  onSubmit: (data: any) => void;
}

export default function LoginForm(/*{ onSubmit }: LoginFormProps*/) {
  const [formData, setFormData] = useState({
    companyCode: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div>
        <label
          htmlFor="companyCode"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Company Code
        </label>
        <input
          type="text"
          id="companyCode"
          name="companyCode"
          required
          placeholder="Enter your company code"
          value={formData.companyCode}
          onChange={handleChange}
          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="john.doe@company.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
            Remember me
          </span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
      >
        Sign In
      </button>

      <div className="text-center mt-6 text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/company-register"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          Register here
        </Link>
      </div>
    </form>
  );
}
