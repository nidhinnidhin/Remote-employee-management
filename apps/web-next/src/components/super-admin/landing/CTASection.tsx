import Link from "next/link";

export default function CTASection() {
  return (
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
  );
}
