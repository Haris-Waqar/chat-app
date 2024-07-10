import { Box, Button } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector } from "@/store/hooks.js";
import axios from "axios";
import Tiptap from "@/components/Tiptap";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";

export default function MessagingArea(props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const { user } = useAuth();
  const selectedUser = useAppSelector((state) => state.user.selectedUser);
  const messagesEndRef = useRef(null); // Reference to the end of messages for scrolling

  console.log("socket status from messaging area ::", props.socket);

  // send message emit
  useEffect(() => {
    props.socket?.on("getMessage", (msgObj) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          updateMessage: msgObj.updateMessage,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setShowNewMessageButton(true); // Show the new message button upon new message arrival
    });
    return () => props.socket?.off("getMessage");
  }, [props.socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/${user?._id}/${selectedUser?._id}`
        );
        const messagesArray = response.data.map((msg) => ({
          sender: msg.senderId === user?._id ? "user" : "bot",
          updateMessage: msg.message,
          time: msg.time,
        }));
        setMessages(messagesArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, []);
  // Scroll to bottom whenever messages change

  const handleSetMessage = (newContent) => {
    newContent = newContent.replace(/<[^>]*>?/gm, "");
    setMessage(newContent);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message) {
      const updateMessage = message.replace(/<[^>]*>?/gm, "");
      if (props.socket && user?._id) {
        let receiverId = selectedUser?._id;
        const senderId = user?._id;
        const time = new Date().toLocaleTimeString();
        props.socket.emit("sendMessage", {
          updateMessage,
          receiverId,
          senderId,
          time,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "user",
            updateMessage,
            time,
          },
        ]);
      }
      setName("");
      setMessage("");
      scrollToBottom(); // Scroll to the bottom after sending a new message
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessageClick = () => {
    scrollToBottom(); // Scroll to the bottom when clicking on "New Message" button
    setShowNewMessageButton(false); // Hide the button after clicking
  };

  return (
    <>
      <Box
        sx={{
          height: "calc(100% - 210px)",
          overflowY: "scroll",
          p: 3,
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
                <Box
                  component="p"
                  sx={{
                    maxWidth: "300px",
                    backgroundColor:
                      msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === "user" ? "white" : "black",
                    padding: "10px",
                    borderRadius: "16px",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  {msg.updateMessage}
                </Box>
                {/* Add  doubleTicks using svg */}
                {msg.sender === "user" && (
                  <Image
                    src="/grayTick.svg"
                    width={30}
                    height={42}
                    alt="placeholder"
                  />
                )}
              </Stack>
              <Box
                sx={{
                  fontSize: "0.8rem",
                  color: "gray",
                }}
              >
                {msg.time && msg.time.slice(0, -3)}
              </Box>
            </Stack>
          ))}
        <div ref={messagesEndRef} /> {/* Ref for scrolling to bottom */}
      </Box>
      {showNewMessageButton && (
        <Box sx={{ textAlign: "center", mt: -4, pa: 0 }}>
          <Button variant="text" onClick={handleNewMessageClick}>
            New Message <ArrowDropDownIcon />
          </Button>
        </Box>
      )}
      <Box>
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
