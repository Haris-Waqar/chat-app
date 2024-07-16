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
import { v4 as uuidv4 } from "uuid";

export default function MessagingArea(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const { user } = useAuth();
  const selectedUser = useAppSelector((state) => state.user.selectedUser);
  const messagesEndRef = useRef(null); // Reference to the end of messages for scrolling

  // send message emit
  useEffect(() => {
    props.socket?.on("getMessage", (msgObj) => {
      console.log("Get message:::", msgObj);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          updateMessage: msgObj.updateMessage,
          time: new Date().toLocaleTimeString(),
          message_random_id: msgObj.message_random_id,
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
          message_random_id: msg.message_random_id,
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
        const message_random_id = uuidv4();
        // Emit sendMessage event and handle response
        props.socket.emit("sendMessage", {
          updateMessage,
          receiverId,
          senderId,
          time,
          message_random_id: message_random_id,
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "user",
            updateMessage,
            time,
            message_random_id: message_random_id,
            status: "sent",
          },
        ]);
      }
      setMessage("");
      scrollToBottom(); // Scroll to the bottom after sending a new message
    }
  };
  console.log("Messages---->>>>", messages);

  useEffect(() => {
    const handleDelivery = (msgObj) => {
      console.log("Message delivered:", msgObj);
      // Find the message in the messages array and update its status
      if (messages && messages.length > 0) {
        console.log("Messages before delivery update:", messages);
      }
      const updatedMessages = messages.map((msg) => {
        if (msg.message_random_id === msgObj.message_random_id) {
          return {
            ...msg,
            status: "delivered",
          };
        }
        return msg;
      });

      setMessages(updatedMessages);
      console.log("Messages after delivery update:", updatedMessages);
    };

    // Attach event listener when component mounts
    props.socket?.on("messageDelivered", handleDelivery);

    // Clean up: detach event listener when component unmounts
    return () => {
      props.socket?.off("messageDelivered", handleDelivery);
    };
  }, [messages, props.socket]);

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
                {msg.sender === "user" && msg.status === "sent" && (
                  <Chip label="Sent" size="small" />
                )}
                {msg.sender === "user" && msg.status === "delivered" && (
                  <Chip label="Delivered" size="small" />
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
