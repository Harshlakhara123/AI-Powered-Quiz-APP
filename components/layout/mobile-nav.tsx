"use client";

import { useSidebar } from "@/hooks/use-sidebar";

export default function MobileNavbar() {
  const { openSidebar } = useSidebar();

  return (
    <nav className="md:hidden flex items-center justify-between w-full p-4 bg-white border-b sticky top-0 z-30">
      <div className="font-bold text-lg">My App</div>
      <button
        onClick={openSidebar}
        className="p-2 bg-indigo-600 text-white rounded-md text-sm font-medium"
      >
        Menu
      </button>
    </nav>
  );
}