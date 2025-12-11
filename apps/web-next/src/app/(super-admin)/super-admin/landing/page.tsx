"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import StatCard from "@/components/features/dashboard/StatCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SuperAdminMarketingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-600">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Secure Administration Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight animate-fade-in-up delay-100">
            Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Platform</span> Control
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            The ultimate command center for managing your entire SaaS platform.
            Monitor companies, users, billing, and system health from one powerful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up delay-300">
            <Link href="/super-admin-login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-rose-500/20 transform hover:-translate-y-0.5 transition-all">
              Access Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
              View Documentation
            </button>
          </div>

          {/* Mock Dashboard UI */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/50 animate-fade-in-up delay-500">
            <div className="absolute top-0 left-0 right-0 h-11 bg-gray-50 border-b border-gray-100 rounded-t-xl flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto text-xs font-medium text-gray-400">superadmin-portal.app</div>
            </div>

            <div className="mt-11 p-6 bg-gray-50/50 rounded-b-xl min-h-[400px]">
              {/* Dashboard Grid Lines (Mock) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                  { l: "Total Companies", v: "512", c: "bg-rose-50 text-rose-600", i: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
                  { l: "Active Users", v: "48.2K", c: "bg-purple-50 text-purple-600", i: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                  { l: "Revenue (MTD)", v: "$284K", c: "bg-green-50 text-green-600", i: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
                  { l: "System Health", v: "99.9%", c: "bg-blue-50 text-blue-600", i: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> }
                ].map((item, idx) => (
                  <StatCard
                    key={idx}
                    label={item.l}
                    value={item.v}
                    className={item.c}
                    icon={item.i}
                  />
                ))}
              </div>
              <div className="bg-white border border-gray-100 rounded-xl h-48 w-full flex items-center justify-center p-8 gap-4">
                <div className="h-full w-16 bg-rose-100 rounded-lg animate-pulse" />
                <div className="h-full w-16 bg-purple-100 rounded-lg animate-pulse delay-75" />
                <div className="h-full w-16 bg-green-100 rounded-lg animate-pulse delay-100" />
                <div className="h-full w-16 bg-blue-100 rounded-lg animate-pulse delay-150" />
                <div className="h-full w-16 bg-orange-100 rounded-lg animate-pulse delay-200" />
                <div className="h-full w-16 bg-teal-100 rounded-lg animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Companies", value: "500+", c: "text-rose-600" },
              { label: "Total Users", value: "50K+", c: "text-purple-600" },
              { label: "Revenue Managed", value: "$2M+", c: "text-rose-600" },
              { label: "Uptime", value: "99.99%", c: "text-purple-600" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h3 className={`text-4xl md:text-5xl font-bold ${stat.c}`}>{stat.value}</h3>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Admin Features</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to manage and monitor your entire platform from a single dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { t: "Company Management", d: "Oversee all registered companies, manage subscriptions, and monitor activity across the platform.", i: "bg-rose-100 text-rose-600", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
              { t: "User Administration", d: "Manage user accounts, permissions, and access controls across all organizations.", i: "bg-rose-100 text-rose-600", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
              { t: "Billing & Subscriptions", d: "Handle billing, invoicing, and subscription management for all clients.", i: "bg-rose-100 text-rose-600", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> },
              { t: "Platform Analytics", d: "Access comprehensive analytics and insights across the entire platform.", i: "bg-rose-100 text-rose-600", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
              { t: "Support Management", d: "Handle support tickets, resolve issues, and maintain client satisfaction.", i: "bg-rose-100 text-rose-600", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /> },
              { t: "Audit Logs", d: "Track all system activities with detailed audit logs and compliance reports.", i: "bg-rose-100 text-rose-600", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.i}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.svg}</svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.t}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Platform Capabilities</h2>
            <p className="text-gray-500">Enterprise-grade tools for complete platform governance and control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { t: "Real-time Monitoring", d: "Monitor platform health and performance in real-time", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> },
              { t: "Data Management", d: "Secure backup, recovery, and data governance tools.", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /> },
              { t: "Infrastructure Control", d: "Manage servers, deployments, and system resources.", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /> },
              { t: "Security Center", d: "Advanced security controls and threat detection", svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> }
            ].map((cap, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 mx-auto bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{cap.svg}</svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{cap.t}</h4>
                <p className="text-sm text-gray-500">{cap.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section (Bottom Image) */}
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
                { l: "256-bit AES", s: "Encryption", i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                { l: "OAuth 2.0", s: "Authentication", i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                { l: "24/7", s: "Monitoring", i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                { l: "99.99%", s: "Uptime SLA", i: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg> }
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

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl shadow-gray-200/50">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Take Control?</h2>
            <p className="text-gray-500 text-lg mb-8">Access your super admin dashboard and manage your entire platform.</p>

            <Link href="/super-admin-login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-rose-500/20 transform hover:-translate-y-0.5 transition-all">
              Access Admin Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <Footer />
    </div>
  );
}
