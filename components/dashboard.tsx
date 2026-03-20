import { Home, Users, FileText, Briefcase, Library, Settings } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  userData?: {
    schoolName: string;
    schoolTown: string;
  };
}

const navItems = [
  { icon: Home, label: "Home", active: false },
  { icon: Users, label: "My Groups", active: false },
  { icon: FileText, label: "Assignments", active: true },
  { icon: Briefcase, label: "AI Teacher's Toolkit", active: false },
  { icon: Library, label: "My Library", active: false },
];

export default function Dashboard({ userData }: DashboardProps) {
  const displaySchool = userData?.schoolName || "Loading school...";
  const displayTown = userData?.schoolTown || "Loading location...";

  return (
    <div className="h-full flex flex-col bg-white p-6 shadow-sm rounded-r-[2rem] md:rounded-[2rem] text-slate-600">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
          V
        </div>
        <span className="text-2xl font-bold text-slate-800">VedaAI</span>
      </div>

      <Link href="/create" className="w-full">
        <button className="flex items-center justify-center gap-2 w-full bg-[#333] text-white py-4 rounded-full font-medium mb-10 border-2 border-orange-600/30 hover:bg-black transition-all">
          <span className="text-xl">+</span> Create Assignment
        </button>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${item.active ? "bg-slate-100 text-slate-900 font-semibold" : "hover:bg-slate-50"
              }`}
          >
            <item.icon size={20} className={item.active ? "text-slate-900" : "text-slate-400"} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl cursor-pointer mb-2">
          <Settings size={20} className="text-slate-400" />
          <span className="text-sm">Settings</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-200 rounded-full flex-shrink-0">
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{displaySchool}</p>
            <p className="text-[10px] text-slate-400">{displayTown}</p>
          </div>
        </div>
      </div>
    </div>
  );
}