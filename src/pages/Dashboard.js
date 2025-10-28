// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

const SOCKET_SERVER_URL =
  process.env.REACT_APP_BACKEND_URL || "https://si-communication-app.onrender.com";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // === Initialize Socket.io ===
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🟢 Connected to chat server:", newSocket.id);
    });

    newSocket.on("chat_history", (history) => {
      setMessages(history);
    });

    newSocket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Disconnected from server");
    });

    return () => newSocket.disconnect();
  }, []);

  // === Send message ===
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;
    const msgData = { sender: user?.email || "Anonymous", text: message };
    socket.emit("chat message", msgData);
    setMessage("");
  };

  // === Logout handler ===
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // === Go to Profile ===
  const goToProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 30,
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <h2>💬 Real-Time Chat Dashboard</h2>
      <p>Logged in as <b>{user?.email}</b></p>

      <div
        style={{
          width: "100%",
          maxWidth: 600,
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: 20,
            paddingRight: 10,
            borderBottom: "1px solid #ddd",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>No messages yet...</p>
          ) : (
            messages.map((msg, i) => {
              const isOwn = msg.startsWith(user?.email);
              return (
                <div
                  key={i}
                  style={{
                    margin: "8px 0",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: isOwn ? "#DCF8C6" : "#f0f0f0",
                    alignSelf: isOwn ? "flex-end" : "flex-start",
                    textAlign: isOwn ? "right" : "left",
                  }}
                >
                  {msg}
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={sendMessage}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: "10px" }}>
        <button
          onClick={goToProfile}
          style={{
            background: "#00b894",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          My Profile
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: "#ff3b3b",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
