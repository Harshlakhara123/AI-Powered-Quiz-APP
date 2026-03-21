"use client";

import { Home, Users, FileText, Briefcase, Library, Settings } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth";

interface DashboardProps {
  userData?: {
    schoolName: string;
    schoolTown: string;
  };
}

import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Users, label: "My Groups", href: "#" },
  { icon: FileText, label: "Assignments", href: "/" },
  { icon: Briefcase, label: "AI Teacher's Toolkit", href: "#" },
  { icon: Library, label: "My Library", href: "#" },
];

export default function Dashboard({ userData }: DashboardProps) {
  const displaySchool = userData?.schoolName || "Loading school...";
  const displayTown = userData?.schoolTown || "Loading location...";
  const pathname = usePathname();

  const getIsActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="h-full flex flex-col bg-white p-6 shadow-sm rounded-r-[2rem] md:rounded-[2rem] text-slate-600">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
          V
        </div>
        <span className="text-2xl font-bold text-slate-800">VedaAI</span>
      </div>

      <Link href="/create" className="w-full relative group">
        <button className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-full font-medium mb-10 border border-slate-800 shadow-sm hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
          <span className="text-xl leading-none mb-0.5 group-hover:rotate-90 transition-transform duration-300">+</span> Create Assignment
        </button>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = getIsActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                isActive ? "bg-slate-100 text-slate-900 font-semibold shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-slate-900" : "text-slate-400 opacity-80"} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 transition-colors duration-200 rounded-xl cursor-pointer mb-2">
          <Settings size={20} className="text-slate-400 opacity-80" />
          <span className="text-sm">Settings</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-100/80 transition-colors duration-200 w-full text-left">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex-shrink-0">
              </div>
              <div className="overflow-hidden max-w-[calc(100%-3rem)]">
                <p className="text-xs font-bold text-slate-800 truncate">{displaySchool}</p>
                <p className="text-[10px] text-slate-400 truncate">{displayTown}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              onClick={async () => {
                await logout();
                window.location.href = '/auth';
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}