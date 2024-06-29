"use client";

import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";

export default function MessagingArea(props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const selectedUser = useAppSelector((state) => state.user.selectedUser);

  console.log("socket status from messaging area ::", props.socket);
  // send message emit
  useEffect(() => {
    console.log("props.socket", props.socket);
    props.socket?.on("getMessage", (msgObj) => {
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
    return () => props.socket?.off("getMessage");
  }, [props.socket]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && message) {
      if (props.socket && user?._id) {
        console.log("sendMessage emit works", props.socket, user?._id);
        let receiverId = "";
        // if (user._id == "667efba8c6ef396531d0f6e2") {
        //   receiverId = "667efbc4c6ef396531d0f6e5";
        // } else {
        //   receiverId = "667efba8c6ef396531d0f6e2";
        // }

        receiverId = selectedUser?._id;
        console.log("receiverId", receiverId);
        props.socket.emit("sendMessage", { message, receiverId });
        setMessages((messages) => [
          ...messages,
          { sender: "user", message, time: new Date().toLocaleTimeString() },
        ]);
      }

      // props.socket.emit("sendMessage", { name, message, to: "7E8-vLy-oQMwcAE3AAAQ" });
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
