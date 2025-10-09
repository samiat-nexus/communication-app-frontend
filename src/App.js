// frontend/src/App.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://si-communication-app.onrender.com"); // backend server URL

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // Receive message
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, { text: data, sender: "other" }]);
    });
    return () => socket.off("receive_message");
  }, []);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send_message", message);
      setChat((prev) => [...prev, { text: message, sender: "me" }]);
      setMessage("");
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", height: "100vh", background: "#f4f4f4", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "400px", background: "white", borderRadius: "15px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#ffd700", padding: "15px", textAlign: "center", fontWeight: "600" }}>Communication App 💬</div>
        <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.sender === "me" ? "right" : "left",
                margin: "5px 0",
              }}
            >
              <span
                style={{
                  background: msg.sender === "me" ? "#ffd700" : "#e0e0e0",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  display: "inline-block",
                  maxWidth: "75%",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#ffd700",
              border: "none",
              padding: "10px 15px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
