"use server";

import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export async function updateAssignmentAction(
  assignmentId: string, 
  generatedContent: unknown, 
  formMetadata: unknown
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = token ? verifyAuthToken(token) : null;

    if (!user) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    // Verify ownership and update
    const updated = await Assignment.findOneAndUpdate(
      { _id: assignmentId, userId: user.userId },
      { $set: { generatedContent, formMetadata } },
      { new: true }
    ).lean();

    if (!updated) {
      return { error: "Assignment not found or unauthorized to update." };
    }

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { error: error.message || "Failed to update assignment." };
  }
}
