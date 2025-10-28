import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username") || "Anonymous";
    setName(username);

    const newSocket = io("http://localhost:5001", {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🟢 Connected");
      newSocket.emit("join", username);
    });

    newSocket.on("chat message", (msg) => setMessages((prev) => [...prev, msg]));
    newSocket.on("online_users", (users) => setOnlineUsers(users));
    newSocket.on("user_typing", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(""), 1500);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const msg = { sender: name, text: input, time: new Date().toLocaleTimeString() };
      socket.emit("chat message", msg);
      setInput("");
    }
  };

  const handleTyping = () => {
    if (socket) socket.emit("typing", name);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-4 relative">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">💬 SNX Chat</h2>

        {/* Online Users */}
        <div className="text-sm text-gray-600 mb-3">
          👥 <b>Online:</b> {onlineUsers.join(", ") || "No one online"}
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto border rounded p-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === name ? "justify-end" : "justify-start"} mb-2`}>
              <div
                className={`p-2 rounded-2xl max-w-[70%] ${
                  msg.sender === name
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <div className="text-sm font-semibold">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">{msg.time || ""}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Typing Indicator */}
        {typingUser && (
          <div className="text-sm italic text-gray-500 mt-1">
            ✍️ {typingUser} is typing...
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 mt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              handleTyping();
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type message..."
            className="flex-grow border rounded-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
