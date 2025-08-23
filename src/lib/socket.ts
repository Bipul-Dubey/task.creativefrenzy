import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
  withCredentials: false,
  transports: ["websocket"],
});

export default socket;
