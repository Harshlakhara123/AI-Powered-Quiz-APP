import { Sparkles, BrainCircuit, PenTool } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? verifyAuthToken(token) : null;

  if (!user) {
    redirect("/auth");
  }

  await dbConnect();
  const assignmentCount = await Assignment.countDocuments({ userId: user.userId });
  const hasAssignments = assignmentCount > 0;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-white to-slate-50/50 rounded-[2rem]">
      <div className="inline-flex items-center justify-center p-4 bg-orange-100/50 rounded-2xl mb-8 ring-1 ring-orange-200 shadow-sm shadow-orange-100">
        <Sparkles className="w-10 h-10 text-orange-500" />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 drop-shadow-sm">
        Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-amber-500">VedaAI</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
        Your ultimate AI-powered quiz generator. Transform existing materials into engaging, structured assessments instantly, tailored to your students&apos; unique needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100/80 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <BrainCircuit size={28} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">AI-Powered Insights</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Harness advanced AI to identify learning gaps and generate perfect rubrics automatically.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100/80 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <PenTool size={28} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Automated Grading</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Save hours with intelligent evaluation of short answers based on customizable marking criteria.</p>
        </div>
      </div>

      <Link href="/create">
        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2">
          {hasAssignments ? "Create Assignment" : "Create Your First Assignment"} <Sparkles className="w-5 h-5 opacity-70" />
        </Button>
      </Link>
    </div>
  );
}

