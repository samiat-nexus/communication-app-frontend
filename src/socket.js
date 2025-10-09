import { io } from "socket.io-client";

const socket = io(" https://si-communication-app.onrender.com", {
  transports: ["websocket"],
});

export default socket;
