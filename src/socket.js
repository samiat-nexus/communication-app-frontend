import { io } from "socket.io-client";
const SOCKET_URL = "https://si-communication-app.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // force WebSocket only
  withCredentials: true,
});

export default socket;
