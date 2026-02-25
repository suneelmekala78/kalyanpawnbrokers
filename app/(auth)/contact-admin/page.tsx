import Link from "next/link";

export default function ContactAdminPage() {
  const supportPhone = process.env.NEXT_PUBLIC_CONTACT_NUMBER || "Not available";

  return (
    <main className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-white">
      <section className="relative hidden lg:flex flex-col justify-between p-12 bg-[radial-gradient(circle_at_top,_#f5e9ff,_#ffffff_55%)]">
        <div className="flex items-center gap-2 text-lg font-extrabold text-[var(--primary)]">
          My<span className="text-black">Finance</span>
        </div>

        <div className="max-w-lg">
          <h1 className="text-4xl font-extrabold leading-tight text-black">
            Need account help?
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Reach the admin team for password reset, account access, or onboarding support.
          </p>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Admin support number</p>
            <p className="mt-2 text-2xl font-bold text-black">{supportPhone}</p>
            <p className="mt-1 text-sm text-gray-500">Available during business hours</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">Secure access for staff only.</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-black/10 p-6 shadow-sm">
          <p className="text-sm font-semibold text-[var(--primary)]">Contact Admin</p>
          <h2 className="mt-1 text-2xl font-extrabold text-black">We’re here to help</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please contact your administrator to recover or unlock your account.
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</p>
            <p className="mt-1 text-lg font-bold text-black">{supportPhone}</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/forgot-password" className="btn-outline w-full text-center">
              Back to forgot password
            </Link>
            <Link href="/login" className="btn-primary w-full text-center">
              Go to login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}