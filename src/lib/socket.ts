import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000";

  if (!socket) {
    socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected successfully. Socket ID:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.io] Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.warn("[Socket.io] Connection error:", error.message);
    });
  } else if (token && socket.auth && (socket.auth as any).token !== token) {
    (socket.auth as any).token = token;
    if (!socket.connected) {
      socket.connect();
    }
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

