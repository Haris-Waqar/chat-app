"use client";

import { Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";
import axios from "axios";

import Tiptap from "@/components/Tiptap";

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
          updateMessage: msgObj.updateMessage,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    });
    return () => props.socket?.off("getMessage");
  }, [props.socket]);

  useEffect(() => {
    // fetch the messages from the database
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${user?._id}/${selectedUser?._id}`
        );
        console.log("response", response.data);

        // const reponseObj = {
        //   _id: "66859392903e8e1f603bfa11",
        //   senderId: "66804c449401f4989c877731",
        //   receiverId: "66804bfe9401f4989c87772a",
        //   message: "Helo jazib bhai",
        //   time: "11:08:18 PM",
        //   __v: 0,
        // };
        // convert the response to the format of the messages array
        const messagesArray = response.data.map((msg) => {
          return {
            sender: msg.senderId === user?._id ? "user" : "bot",
            updateMessage: msg.message,
            time: msg.time,
          };
        });
        setMessages(messagesArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const handleSetMessage = (newContent) => {
    newContent = newContent.replace(/<[^>]*>?/gm, "");
    console.log("new content", newContent);
    setMessage(newContent);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message) {
      console.log("working", message);

      //   <p>hello</p> this is the message , extract the text from it
      const updateMessage = message.replace(/<[^>]*>?/gm, "");
      console.log("message", updateMessage);

      if (props.socket && user?._id) {
        console.log("sendMessage emit works", props.socket, user?._id);
        let receiverId = "";
        // if (user._id == "667efba8c6ef396531d0f6e2") {
        //   receiverId = "667efbc4c6ef396531d0f6e5";
        // } else {
        //   receiverId = "667efba8c6ef396531d0f6e2";
        // }

        receiverId = selectedUser?._id;
        const senderId = user?._id;
        const time = new Date().toLocaleTimeString();
        console.log("receiverId", receiverId);
        props.socket.emit("sendMessage", {
          updateMessage,
          receiverId,
          senderId,
          time,
        });
        setMessages((messages) => [
          ...messages,
          {
            sender: "user",
            updateMessage,
            time: time,
          },
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

  return (
    <>
      <Box
        sx={{
          height: "calc(100% - 210px)",
          overflowY: "scroll",
          p: 3,
          // hide scrollbar
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {messages &&
          messages.map((msg, index) => (
            <Stack
              key={index}
              direction="column"
              alignItems={msg.sender === "user" ? "flex-end" : "flex-start"}
              spacing={1}
              mb={2}
            >
              <Stack direction="row" spacing={1}>
                <Chip
                  label={msg.updateMessage}
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
        {/* <form onSubmit={handleSubmit}>
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
        </form> */}
        {/* <Tiptap />
        <Button type="submit">Send</Button> */}
        <form onSubmit={handleSubmit}>
          <Tiptap
            content={message}
            onChange={(newContent) => handleSetMessage(newContent)}
          />
        </form>
      </Box>
    </>
  );
}
