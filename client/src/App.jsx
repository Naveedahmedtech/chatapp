import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, List, ListItem, Typography } from "@mui/material";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [name, setName] = useState("");
  const [usersOnline, setUsersOnline] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);

  useEffect(() => {
    socket.on("userList", (users) => {
      setUsersOnline(users);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    });

    return () => {
      socket.off();
    };
  }, []);

  const handleJoin = () => {
    socket.emit("join", name);
  };

  const handleSendMessage = () => {
    socket.emit("sendMessage", { name: name, message: message });
    setMessage("");
  };

  // console.log(usersOnline);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleJoin}>Join</Button>

      <Typography>Online Users:</Typography>
      <List>
        {usersOnline.map((user) => (
          <ListItem key={user}>{user}</ListItem>
        ))}
      </List>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          height: "300px",
          width: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
        ref={messageListRef}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
      </div>

      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
}

export default App;
