// src/pages/Dashboard.js
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const BACKEND = process.env.REACT_APP_BACKEND_URL || "https://si-communication-app.onrender.com";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    // send token at connect for server-side verification
    const token = localStorage.getItem("token");
    const s = io(BACKEND, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("🟢 connected to socket:", s.id);
    });

    s.on("chat_history", (history) => {
      // history: array of message objects
      setMessages(history || []);
      // scroll after a tick
      setTimeout(() => scrollToBottom(), 100);
    });

    s.on("chat message", (msg) => {
      // msg: single message object
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => scrollToBottom(), 40);
    });

    s.on("disconnect", () => {
      console.log("🔴 socket disconnected");
    });

    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    // We emit only text; server will attach userId/sender from JWT
    socket.emit("chat message", { text: message });
    setMessage("");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 30, height: "100vh", background: "#f5f5f5" }}>
      <h2>💬 Real-Time Chat Dashboard</h2>
      <p>Logged in as <b>{user?.email}</b></p>

      <div style={{ width: "100%", maxWidth: 700, background: "#fff", borderRadius: 12, padding: 20, marginTop: 20, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", flex: 1 }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", marginBottom: 20, paddingRight: 10, borderBottom: "1px solid #ddd", maxHeight: "60vh" }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>No messages yet...</p>
          ) : (
            messages.map((msg) => {
              // msg shape: { _id, userId, sender, text, timestamp }
              const isOwn = msg.userId && user && (String(msg.userId) === String(user._id || user.id));
              return (
                <div key={msg._id} style={{
                  display: "inline-block",
                  margin: "8px 0",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: isOwn ? "#DCF8C6" : "#f0f0f0",
                  alignSelf: isOwn ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  textAlign: isOwn ? "right" : "left",
                  marginLeft: isOwn ? "auto" : undefined
                }}>
                  <div style={{ fontSize: 12, color: "#333", marginBottom: 4 }}><strong>{msg.sender}</strong></div>
                  <div style={{ fontSize: 14, color: "#111" }}>{msg.text}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>{new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc", outline: "none" }} />
          <button type="submit" style={{ background: "#007bff", color: "#fff", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}>Send</button>
        </form>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={goToProfile} style={{ background: "#00b894", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>My Profile</button>
        <button onClick={handleLogout} style={{ background: "#ff3b3b", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>Logout</button>
      </div>
    </div>
  );
}
