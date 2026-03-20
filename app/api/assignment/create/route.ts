import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Types } from "mongoose";

import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";
import { verifyAuthToken } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { getAssignmentQueue } from "@/lib/queues/assignmentQueue";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

function isFileLike(value: unknown): value is File {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { arrayBuffer?: unknown };
  return typeof candidate.arrayBuffer === "function";
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const auth = verifyAuthToken(token);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = String(formData.get("title") || "").trim();
    if (!title) {
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 }
      );
    }

    const imageCandidate =
      formData.get("image") ?? formData.get("file") ?? formData.get("upload");
    if (!isFileLike(imageCandidate)) {
      return NextResponse.json(
        { error: "Missing required image upload" },
        { status: 400 }
      );
    }

    const image = imageCandidate;
    const mimeType = image.type || "";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "Invalid image type. Use JPEG or PNG." },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image too large. Max size is 10MB." },
        { status: 400 }
      );
    }

    const formMetadataRaw = formData.get("formMetadata");
    let formMetadata: Record<string, unknown> = {};
    if (typeof formMetadataRaw === "string" && formMetadataRaw.trim()) {
      try {
        const parsed: unknown = JSON.parse(formMetadataRaw);
        if (parsed && typeof parsed === "object") {
          formMetadata = parsed as Record<string, unknown>;
        } else {
          return NextResponse.json(
            { error: "formMetadata must be a JSON object." },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "formMetadata must be valid JSON." },
          { status: 400 }
        );
      }
    }

    const assignment = await Assignment.create({
      userId: new Types.ObjectId(auth.userId),
      title,
      status: "processing",
      formMetadata,
    });

    const arrayBuffer = await image.arrayBuffer();
    const data = Buffer.from(arrayBuffer);

    const uploadResult = await uploadToR2({
      filename: image.name || "assignment-image.png",
      contentType: mimeType,
      data,
      folder: "assignments",
    });

    assignment.fileUrl = uploadResult.fileUrl;
    assignment.fileKey = uploadResult.key;
    await assignment.save();

    const assignmentQueue = getAssignmentQueue();
    await assignmentQueue.add(
      "generate_assignment_content",
      {
        assignmentId: assignment._id.toString(),
        fileKey: uploadResult.key,
        fileUrl: uploadResult.fileUrl,
        mimeType,
      },
      { jobId: assignment._id.toString() }
    );

    return NextResponse.json({
      assignmentId: assignment._id.toString(),
      status: assignment.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

