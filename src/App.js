// frontend/src/App.js
import React, { useState, useEffect } from "react";
import socket from "./socket";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "https://si-communication-app.onrender.com";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load messages when page loads
  useEffect(() => {
    fetch(`${API_BASE}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("❌ Failed to fetch messages:", err));
  }, []);

  // Connect socket
  useEffect(() => {
    socket.on("connect", () => console.log("🟢 Connected to live socket server"));
    socket.on("disconnect", () => console.log("🔴 Disconnected from socket server"));

    // Receive new messages
    socket.on("chat message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Receive chat history
    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("chat message");
      socket.off("chat_history");
    };
  }, []);

  // Handle send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("chat message", input);
    setInput("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Communication App</h1>

      <div style={styles.chatBox}>
        {messages.length === 0 ? (
          <p style={styles.placeholder}>No messages yet...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={styles.message}>{msg}</div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

// --- Basic styling ---
const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f2f2f2",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#222",
  },
  chatBox: {
    width: "90%",
    maxWidth: "500px",
    height: "60vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  message: {
    background: "#e1eaff",
    padding: "10px 14px",
    borderRadius: "8px",
    margin: "6px 0",
    alignSelf: "flex-start",
    color: "#333",
  },
  placeholder: {
    color: "#aaa",
    textAlign: "center",
    marginTop: "30%",
  },
  form: {
    display: "flex",
    width: "90%",
    maxWidth: "500px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    marginLeft: "10px",
    cursor: "pointer",
  },
};

export default App;
