"use client";

import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import io from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";

export default function MessagingArea() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    console.log("I am here", user);
    if (socket && user?._id) {
      console.log("AddNewUser emit works", user?._id);
      socket.emit("addNewUser", user._id);
    }
  }, [socket]);

  // useEffect(() => {
  //   socket.on("message", (message) => {
  //     console.log("from bot===>>", message);

  //     setMessages((messages) => [...messages, message]);
  //   });
  //   return () => socket.off("message");
  // }, []);

  // send message emit
  useEffect(() => {
    socket?.on("getMessage", (msgObj) => {
      console.log("from bot===>>", msgObj);
      setMessages((messages) => [
        ...messages,
        {
          sender: "bot",
          message: msgObj.message,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    });
    return () => socket?.off("getMessage");
  }, [socket]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && message) {
      if (socket && user?._id) {
        console.log("sendMessage emit works", socket, user?._id);
        let receiverId = "";
        if (user._id == "667efba8c6ef396531d0f6e2") {
          receiverId = "667efbc4c6ef396531d0f6e5";
        } else {
          receiverId = "667efba8c6ef396531d0f6e2";
        }
        socket.emit("sendMessage", { message, receiverId });
        setMessages((messages) => [
          ...messages,
          { sender: "user", message, time: new Date().toLocaleTimeString() },
        ]);
      }

      // socket.emit("sendMessage", { name, message, to: "7E8-vLy-oQMwcAE3AAAQ" });
      // setMessages((messages) => [
      //   ...messages,
      //   { sender: "user", message, time: new Date().toLocaleTimeString() },
      // ]);
      setName("");
      setMessage("");
    }
  };

  //   const messages = [
  //     {
  //       sender: "user",
  //       message: "Hello",
  //       time: "10:00 AM",
  //     },
  //     {
  //       sender: "user",
  //       message: "How are you?",
  //       time: "10:01 AM",
  //     },

  //     {
  //       sender: "bot",
  //       message: "Hi",
  //       time: "10:02 AM",
  //     },

  //     {
  //       sender: "bot",
  //       message: "I am fine. How can I help you?",
  //       time: "10:03 AM",
  //     },
  //     {
  //       sender: "user",
  //       message: "I need help with my account",
  //       time: "10:04 AM",
  //     },
  //     {
  //       sender: "bot",
  //       message:
  //         "Sure, I can help you with that. Please provide me with your email address",
  //       time: "10:05 AM",
  //     },
  //     {
  //       sender: "user",
  //       message: "My email address is xyz@test.com",
  //       time: "10:06 AM",
  //     },
  //     {
  //       sender: "bot",
  //       message: "Thank you. Please wait for a moment",
  //       time: "10:07 AM",
  //     },
  //     {
  //       sender: "bot",
  //       message: "I have found your account. What do you want to do next?",
  //       time: "10:08 AM",
  //     },
  //     {
  //       sender: "user",
  //       message: "I want to change my password",
  //       time: "10:09 AM",
  //     },
  //     {
  //       sender: "bot",
  //       message: "Sure. Please provide me with your new password",
  //       time: "10:10 AM",
  //     },
  //     {
  //       sender: "user",
  //       message: "My new password is 123456",
  //       time: "10:11 AM",
  //     },
  //     {
  //       sender: "bot",
  //       message: "Your password has been changed successfully",
  //       time: "10:12 AM",
  //     },
  //   ];
  return (
    <>
      <Box
        sx={{
          height: "calc(100% - 180px)",
          overflowY: "scroll",
          p: 3,
          // hide scrollbar
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {messages.map((msg, index) => (
          <Stack
            key={index}
            direction="column"
            alignItems={msg.sender === "user" ? "flex-end" : "flex-start"}
            spacing={1}
            mb={2}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                label={msg.message}
                variant="filled"
                color={msg.sender === "user" ? "primary" : "secondary"}
              />
            </Stack>
            <Box
              sx={{
                fontSize: "0.8rem",
                color: "gray",
              }}
            >
              {msg.time}
            </Box>
          </Stack>
        ))}
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            placeholder="Your name"
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            value={message}
            placeholder="Your message"
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </Box>
    </>
  );
}
