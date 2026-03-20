"use client";

import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GenerationCompletePayload = {
  assignmentId: string;
  generatedContent: unknown;
};

export default function CreateAssignmentPage() {
  const wsUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4001";
  }, []);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [marks, setMarks] = useState("10");
  const [file, setFile] = useState<File | null>(null);

  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<unknown | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const socket: Socket = io(wsUrl, { transports: ["websocket"] });

    socket.emit("subscribe_generation", assignmentId);

    const onComplete = (payload: GenerationCompletePayload) => {
      if (payload?.assignmentId !== assignmentId) return;
      setGeneratedContent(payload.generatedContent);
      setStatus("completed");
      setError(null);
      socket.disconnect();
    };

    socket.on("generation_complete", onComplete);

    return () => {
      socket.off("generation_complete", onComplete);
      socket.disconnect();
    };
  }, [assignmentId, wsUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!file) {
      setError("Please upload a JPEG or PNG image.");
      return;
    }

    setStatus("processing");
    setGeneratedContent(null);
    setAssignmentId(null);

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("difficulty", difficulty);
    formData.set("marks", marks);
    formData.set(
      "formMetadata",
      JSON.stringify({
        difficulty,
        marks: Number(marks),
      })
    );
    formData.set("image", file);

    const res = await fetch("/api/assignment/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(data?.error || "Failed to create assignment.");
      return;
    }

    setAssignmentId(data.assignmentId);
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="w-full max-w-xl rounded-[2rem] shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment title"
              required
              aria-label="Assignment title"
            />

            <div className="flex gap-3">
              <Input
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="Difficulty (easy/medium/hard)"
                aria-label="Difficulty"
              />
              <Input
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="Marks"
                aria-label="Marks"
              />
            </div>

            <Input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
              }}
              aria-label="Upload image"
            />

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 rounded-full py-6"
              disabled={status === "processing"}
            >
              {status === "processing" ? "Generating..." : "Create & Generate"}
            </Button>

            {status === "error" && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {status === "processing" && assignmentId && (
              <p className="text-sm text-slate-600">
                Processing assignment. Waiting for Gemini...
              </p>
            )}

            {status === "completed" &&
              generatedContent !== null &&
              generatedContent !== undefined && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold mb-2">Generated JSON</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(generatedContent, null, 2)}
                </pre>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

