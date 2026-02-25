"use client";

import Link from "next/link";

interface TopbarProps {
  userName: string;
}

const Topbar = ({ userName }: TopbarProps) => {
  const cleanName = userName?.trim() || "User";
  const userInitial = cleanName.charAt(0).toUpperCase();

  return (
    <header
      className="
        h-14 px-6 flex items-center justify-between
        bg-white border-b border-black/10
        sticky top-0 z-30
      "
    >
      <div className="flex items-center gap-3">
        <h1 className="text-[var(--primary)] font-bold text-lg">{cleanName}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* <button type="button" className="text-xl text-gray-600 hover:text-black">
          <HiOutlineBell />
        </button> */}

        {/* <a
          href="https://getmaterials.netlify.app"
          target="_blank"
          className="text-sm font-semibold text-[var(--primary)]"
        >
          View Site
        </a> */}

        <Link
          href="/settings"
          className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold"
          aria-label="Go to settings"
          title="Settings"
        >
          {userInitial}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
