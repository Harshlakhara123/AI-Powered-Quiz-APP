"use client";

import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import Dashboard from "../dashboard";



function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen w-full bg-[#E5E5E5] p-0 md:p-6 overflow-hidden">
      {/* Floating Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Dashboard />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-6">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md rounded-[1.5rem] mb-6 px-6 py-3 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-4 text-slate-400">
             <button className="p-2 hover:bg-slate-100 rounded-full">←</button>
             <span className="text-sm font-medium">Assignment</span>
           </div>
           <div className="flex items-center gap-4">
             <div className="relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                <span className="text-xl">🔔</span>
             </div>
             <div className="flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-full border border-slate-100">
                <div className="w-8 h-8 bg-orange-100 rounded-full"></div>
                <span className="text-xs font-bold text-slate-800">John Doe ∨</span>
             </div>
           </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 bg-[#F5F5F5] rounded-[2rem] overflow-y-auto relative">
           {children}
        </div>
      </main>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={closeSidebar} />
      )}
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}