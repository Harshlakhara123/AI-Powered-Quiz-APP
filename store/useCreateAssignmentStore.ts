import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface CreateAssignmentState {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  error: string | null;
  assignmentId: string | null;
  generatedContent: unknown | null;
  socket: Socket | null;

  setUploading: () => void;
  setProcessing: (assignmentId: string, wsUrl: string) => void;
  setCompleted: (content: unknown) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useCreateAssignmentStore = create<CreateAssignmentState>((set, get) => ({
  status: "idle",
  error: null,
  assignmentId: null,
  generatedContent: null,
  socket: null,

  setUploading: () => set({ status: "uploading", error: null }),

  setProcessing: (assignmentId: string, wsUrl: string) => {
    set({ status: "processing", assignmentId, error: null });

    const socket = io(wsUrl, { transports: ["websocket"] });
    socket.emit("subscribe_generation", assignmentId);

    socket.on("generation_complete", (payload: { assignmentId: string; generatedContent: unknown }) => {
      if (payload?.assignmentId === assignmentId) {
        get().setCompleted(payload.generatedContent);
        socket.disconnect();
      }
    });

    socket.on("generation_failed", (payload: { assignmentId: string; error: string }) => {
      if (payload?.assignmentId === assignmentId) {
        get().setError(payload.error);
        socket.disconnect();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      // Wait for fallback polling or handle error? For now we just keep processing...
    });

    set({ socket });
  },

  setCompleted: (content: unknown) => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ status: "completed", generatedContent: content, socket: null });
  },

  setError: (error: string) => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ status: "error", error, socket: null });
  },

  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      status: "idle",
      error: null,
      assignmentId: null,
      generatedContent: null,
      socket: null,
    });
  },
}));
