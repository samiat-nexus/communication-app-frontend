// src/pages/Chat.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = "https://si-communication-app.onrender.com";

const socket = io(SOCKET_URL, { transports: ["websocket"] });

function Chat() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // --- Receive old + new messages ---
  useEffect(() => {
    socket.on("previousMessages", (msgs) => setChat(msgs));
    socket.on("receiveMessage", (msg) => setChat((prev) => [...prev, msg]));

    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);

  // --- Send message ---
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msgData = { sender: user.email, text: message };
    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h2 style={styles.title}>💬 Real-Time Chat</h2>
        <div style={styles.messages}>
          {chat.map((msg, i) => (
            <p key={i} style={styles.message}>
              <strong>{msg.sender}: </strong>{msg.text}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage} style={styles.form}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Send</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    fontFamily: "'Poppins', sans-serif",
  },
  chatBox: {
    width: "400px",
    height: "500px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    color: "#333",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "10px",
    padding: "5px",
  },
  message: {
    background: "#e9ebff",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "5px",
  },
  form: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    marginLeft: "8px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#6C63FF",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Chat;
