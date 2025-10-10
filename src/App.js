import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://si-communication-app.onrender.com"); // ✅ Live backend URL

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔹 Load previous messages from MongoDB
  useEffect(() => {
    fetch("https://si-communication-app.onrender.com/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Failed to load messages:", err));
  }, []);

  // 🔹 Listen for new messages from socket.io
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // 🔹 Send message to server
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Live Communication App</h2>

      <div style={styles.chatBox}>
        {messages.length === 0 ? (
          <p style={styles.empty}>No messages yet...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={styles.message}>
              {msg}
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button style={styles.button} type="submit">
          Send 🚀
        </button>
      </form>
    </div>
  );
}

// 💎 Simple CSS styling
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "50px auto",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    color: "#333",
    marginBottom: "15px",
  },
  chatBox: {
    height: "350px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "15px",
    background: "#fafafa",
  },
  empty: {
    color: "#999",
    fontStyle: "italic",
  },
  message: {
    background: "#f0f0f0",
    padding: "8px 12px",
    borderRadius: "8px",
    margin: "6px 0",
    textAlign: "left",
  },
  form: {
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    background: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default App;
