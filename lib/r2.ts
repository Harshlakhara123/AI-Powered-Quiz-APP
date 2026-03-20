import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function env(name: string): string | undefined {
  return process.env[name];
}

function getS3Client() {
  const endpoint = env("R2_ENDPOINT");
  const accessKeyId = env("R2_ACCESS_KEY_ID");
  const secretAccessKey = env("R2_SECRET_ACCESS_KEY");

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function streamToBuffer(stream: AsyncIterable<Uint8Array>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export async function uploadToR2(params: {
  filename: string;
  contentType: string;
  data: Buffer;
  folder?: string;
}) {
  const bucket = env("R2_BUCKET");
  const publicBaseUrl = env("R2_PUBLIC_BASE_URL");

  const s3 = getS3Client();
  if (!bucket || !s3) {
    throw new Error("R2 is not configured (missing R2_* environment variables).");
  }

  const id = randomUUID();
  const safeName = params.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const folder = params.folder ? params.folder.replace(/\/+$/, "") : "assignments";
  const key = `${folder}/${id}/${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.data,
      ContentType: params.contentType,
    })
  );

  const fileUrl =
    publicBaseUrl?.replace(/\/+$/, "") !== undefined
      ? `${publicBaseUrl?.replace(/\/+$/, "")}/${key}`
      : `${(env("R2_ENDPOINT") || "").replace(/\/+$/, "")}/${bucket}/${key}`;

  return { key, fileUrl };
}

export async function downloadFromR2(params: { key: string }): Promise<Buffer> {
  const bucket = env("R2_BUCKET");
  const s3 = getS3Client();
  if (!bucket || !s3) {
    throw new Error("R2 is not configured (missing R2_* environment variables).");
  }

  const result = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: params.key,
    })
  );

  if (!result.Body) {
    throw new Error("R2 object not found (empty Body).");
  }

  return streamToBuffer(result.Body as AsyncIterable<Uint8Array>);
}

