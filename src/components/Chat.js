import React, { useState, useEffect } from "react";
import socket from "../socket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>💬 Real-time Chat</h2>

      <div
        style={{
          width: "60%",
          margin: "20px auto",
          height: "300px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "50%", padding: "10px", borderRadius: "5px" }}
      />
      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "gold",
          fontWeight: "bold",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;