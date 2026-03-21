import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";
import { EmptyState } from "@/components/assignments/empty-state";
import { AssignmentList } from "@/components/assignments/assignment-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AssignmentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? verifyAuthToken(token) : null;

  if (!user) {
    redirect("/auth");
  }

  await dbConnect();
  const assignmentsData = await Assignment.find({ userId: user.userId }).sort({ createdAt: -1 }).lean();
  
  // Serialize ObjectIds for Client Components
  const assignments = assignmentsData.map(a => ({
    ...a,
    _id: a._id.toString(),
    userId: a.userId.toString(),
  }));

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and create assignments for your classes.</p>
        </div>
      </div>

      <AssignmentList assignments={assignments} />
      
      {/* Floating Create Button */}
      <div className="fixed bottom-10 left-1/2 md:left-[calc(50%+144px)] -translate-x-1/2 z-10 pointer-events-none w-full flex justify-center">
        <div className="pointer-events-auto shadow-2xl rounded-full bg-white/20 backdrop-blur-md p-2">
            <Link href="/create">
                <Button className="bg-black text-white hover:bg-slate-800 rounded-full px-8 py-6 font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95">
                <span className="text-xl mr-2">+</span> Create Assignment
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}