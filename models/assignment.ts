import { Schema, model, models, Types } from "mongoose";

const AssignmentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    fileUrl: { type: String },
    formMetadata: {
      type: Schema.Types.Mixed,
    },
    generatedContent: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment =
  models.Assignment || model("Assignment", AssignmentSchema);

export default Assignment;

