"use client";

import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import Dashboard from "../dashboard";
import { BottomNav } from "./bottom-nav";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth";

interface UserLayoutInfo {
  name: string;
  schoolName: string;
  schoolTown: string;
}

function LayoutContent({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: UserLayoutInfo;
}) {
  const { isOpen, closeSidebar, toggleSidebar } = useSidebar();

  const displayName = user?.name ?? "Guest";

  return (
    <div className="flex h-screen w-full bg-[#E5E5E5] p-0 md:p-6 overflow-hidden">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Dashboard
          userData={
            user && {
              schoolName: user.schoolName,
              schoolTown: user.schoolTown,
            }
          }
        />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 md:ml-6">
        <header className="bg-white/80 backdrop-blur-md rounded-[1.5rem] mb-6 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-slate-400">
            <button className="p-2 hover:bg-slate-100 rounded-full md:hidden" onClick={toggleSidebar}>←</button>
            <span className="text-sm font-medium">Assignment</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
              <span className="text-xl">🔔</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-full border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full" />
                  <span className="text-xs font-bold text-slate-800">
                    {displayName} ∨
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        </header>

        <div className="flex-1 bg-[#F5F5F5] rounded-[2rem] overflow-y-auto relative pb-32 md:pb-0">
          {children}
        </div>
      </main>

      <BottomNav />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}

export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: UserLayoutInfo;
}) {
  return (
    <SidebarProvider>
      <LayoutContent user={user}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
