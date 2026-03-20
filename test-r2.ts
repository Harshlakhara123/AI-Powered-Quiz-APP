import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getS3Client } from "./lib/r2.js"; // Wait, getS3Client is not exported. Let me just re-implement a tiny part here or use standard imports

import { S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;

import fs from "fs";

function log(msg: string) {
  fs.appendFileSync("r2-result.txt", msg + "\n");
}

log("Testing R2 connection...");
log("Endpoint: " + endpoint);
log("Bucket: " + bucket);

if (!endpoint || !accessKeyId || !secretAccessKey) {
  log("Missing R2 credentials");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function main() {
  try {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        MaxKeys: 1,
      })
    );
    log("Successfully connected to R2!");
    log("Objects found: " + (res.Contents?.length || 0));
  } catch (error: any) {
    log("Error connecting to R2:");
    log(error.toString());
  }
}

main();
