import Link from "next/link";
import { FileText, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 bg-white/50 rounded-full scale-110 flex items-center justify-center">
          <div className="relative z-10 text-8xl text-slate-300">
            <FileText size={100} strokeWidth={1} />
            <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-lg">
              <SearchX className="text-red-500" size={40} />
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">No assignments yet</h1>
      <p className="text-slate-500 max-w-sm mb-10 leading-relaxed text-sm">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link href="/create">
        <Button className="bg-black text-white px-8 py-6 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="text-xl">+</span> Create Your First Assignment
        </Button>
      </Link>
    </div>
  );
}
