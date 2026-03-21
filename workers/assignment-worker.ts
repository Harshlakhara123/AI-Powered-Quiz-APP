import { Worker } from "bullmq";

import dbConnect from "@/lib/dbConnect";
import Assignment from "@/models/assignment";
import { downloadFromR2 } from "@/lib/r2";
import { generateAssignmentContent } from "@/lib/gemini";
import { startWsGateway } from "@/lib/wsGateway";
import { QUEUE_NAME, connection } from "@/lib/queues/assignmentQueue";

type GenerateAssignmentJob = {
  assignmentId: string;
  fileKey: string;
  fileUrl?: string;
  mimeType?: string;
};

async function processJob(job: import("bullmq").Job<GenerateAssignmentJob>) {
  const { assignmentId, fileKey, mimeType } = job.data;

  await dbConnect();

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment not found: ${assignmentId}`);
  }

  const imageBuffer = await downloadFromR2({ key: fileKey });
  const base64 = imageBuffer.toString("base64");

  const generatedContent = await generateAssignmentContent({
    imageBase64: base64,
    mimeType: mimeType || "image/png",
    formMetadata: assignment.formMetadata,
  });

  assignment.status = "completed";
  assignment.generatedContent = generatedContent;
  await assignment.save();

  const io = startWsGateway();
  io.to(assignmentId).emit("generation_complete", {
    assignmentId,
    generatedContent,
  });
}

async function main() {
  startWsGateway();

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      if (!job) return;
      await processJob(job as import("bullmq").Job<GenerateAssignmentJob>);
    },
    { connection }
  );

  worker.on("failed", (job, err) => {
    const id = job?.data?.assignmentId;
    console.error(`Job failed for assignment ${id}:`, err);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

