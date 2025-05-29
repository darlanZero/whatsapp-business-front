import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";
import { TOKEN_KEY } from "./cookies-keys";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = Cookies.get(TOKEN_KEY);

    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", {
      ...(token && { auth: { token } }),
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket!.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erro ao conectar ao socket:", err.message);
    });
  }

  return socket;
};
