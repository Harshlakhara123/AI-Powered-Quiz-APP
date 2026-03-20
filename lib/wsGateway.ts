import http from "http";
import { Server } from "socket.io";

let io: Server | null = null;
let server: http.Server | null = null;

function env(name: string): string | undefined {
  return process.env[name];
}

export function startWsGateway() {
  if (io) return io;

  const port = Number(env("WS_PORT") || 4001);

  server = http.createServer();
  io = new Server(server, {
    cors: {
      origin: env("WS_CORS_ORIGIN") || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("subscribe_generation", (assignmentId: string) => {
      if (typeof assignmentId === "string" && assignmentId.length > 0) {
        socket.join(assignmentId);
      }
    });
  });

  server.listen(port);
  return io;
}

export function getWsGateway() {
  if (!io) throw new Error("WebSocket gateway not started.");
  return io;
}

