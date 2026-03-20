import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";
import { AssignmentOutput } from "@/components/assignments/assignment-output";
import { Types } from "mongoose";

export default async function AssignmentPage(props: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? verifyAuthToken(token) : null;
  if (!user) redirect("/auth");

  const { id } = await props.params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();
  const assignment = await Assignment.findOne({ _id: id, userId: user.userId }).lean();
  if (!assignment) notFound();

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-[#F5F5F5]">
      <AssignmentOutput assignment={JSON.parse(JSON.stringify(assignment))} user={user} />
    </div>
  );
}
