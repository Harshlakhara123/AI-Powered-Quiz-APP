"use client";

import Link from "next/link";
import { LayoutGrid, FileText, Library, Sparkles, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutGrid, label: "Home", href: "/dashboard" },
  { icon: FileText, label: "Assignments", href: "/" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Sparkles, label: "AI Toolkit", href: "/ai-toolkit" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Highlight Assignments as active by default if no direct exact match just to match the screenshot vibe
  const isAssignmentsActive = pathname.includes("/assignment") || pathname === "/";
  const getIsActive = (href: string) => {
    if (href === "/") return isAssignmentsActive;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full px-4 pb-6 pt-4 z-40 pointer-events-none flex flex-col items-end">
      <Link 
        href="/create" 
        className="mb-4 w-14 h-14 bg-white text-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] pointer-events-auto border border-gray-100 hover:scale-105 transition-transform"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Link>
      <div className="bg-[#1A1A1A] w-full rounded-full px-6 py-4 flex items-center justify-between text-slate-400 pointer-events-auto">
        {navItems.map((item) => {
          const active = getIsActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                active ? "text-white" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <item.icon size={22} className={active ? "text-white" : "text-slate-400"} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
