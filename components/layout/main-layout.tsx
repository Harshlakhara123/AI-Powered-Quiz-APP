"use client";

import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";
import MobileNavbar from "./mobile-nav";
import Dashboard from "../dashboard";


// This inner component is needed to access the useSidebar hook
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      {/* Top Navbar for Mobile */}
      <MobileNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col items-center justify-center p-6">
          {children}
        </main>

        {/* Dashboard Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:block
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Internal Close Button for Mobile */}
          <button
            onClick={closeSidebar}
            className="md:hidden absolute top-4 right-[-3rem] bg-white p-2 rounded-full shadow-lg"
          >
            ✕
          </button>
          <Dashboard />
        </aside>

        {/* Backdrop for Mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </div>
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