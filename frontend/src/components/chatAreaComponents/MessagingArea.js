import { Box, Button } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Stack from "@mui/material/Stack";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";
import { updateLastMessage } from "@/store/slices/UserSlice.js";
import axios from "axios";
import Tiptap from "@/components/Tiptap";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { v4 as uuidv4 } from "uuid";

export default function MessagingArea(props) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true); // Track if the user is at the bottom
  const { user } = useAuth();
  const selectedUser = useAppSelector((state) => state.user.selectedUser);
  const messagesEndRef = useRef(null); // Reference to the end of messages for scrolling
  const messagesContainerRef = useRef(null); // Reference to the messages container
  const selectedUserRef = useRef(selectedUser); // Ref to keep track of the latest selectedUser state
  const editorRef = useRef(null); // Ref to store the editor instance

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser?._id && user?._id && props.socket) {
      props.socket.emit("openChat", {
        userId: user._id,
        chatWithUserId: selectedUser._id,
      });
    }
  }, [selectedUser, user, props.socket]);

  useEffect(() => {
    const handleRead = (msgObj) => {
      const updatedMessages = messages.map((msg) => {
        if (msg.message_random_id === msgObj.message_random_id) {
          return { ...msg, status: "read" };
        }
        return msg;
      });
      setMessages(updatedMessages);
    };

    props.socket?.on("messageRead", handleRead);
    return () => {
      props.socket?.off("messageRead", handleRead);
    };
  }, [messages, props.socket]);

  useEffect(() => {
    props.socket?.on("getMessage", (msgObj) => {
      if (selectedUserRef.current._id === msgObj.senderId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            updateMessage: msgObj.updateMessage,
            time: new Date().toLocaleTimeString(),
            message_random_id: msgObj.message_random_id,
          },
        ]);
        setShowNewMessageButton(true);
        props.socket.emit("openChat", {
          userId: user._id,
          chatWithUserId: selectedUser._id,
        });
      }
      dispatch(
        updateLastMessage({
          userId: msgObj.senderId,
          lastMessage: msgObj.updateMessage,
        })
      );
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
          status: msg.status,
        }));
        setMessages(messagesArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change and user is at the bottom
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const handleSetMessage = (newContent) => {
    newContent = newContent.replace(/<[^>]*>?/gm, "");
    props.socket.emit("userTyping", {
      userId: user._id,
      chatWithUserId: selectedUser._id,
    });
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
            message_random_id,
            status: "sent",
          },
        ]);
        dispatch(
          updateLastMessage({
            userId: receiverId,
            lastMessage: updateMessage,
          })
        );
      }
      setMessage("");
      if (editorRef.current) {
        editorRef.current.commands.clearContent();
      }
    }
  };

  useEffect(() => {
    const handleDelivery = (msgObj) => {
      const updatedMessages = messages.map((msg) => {
        if (msg.message_random_id === msgObj.message_random_id) {
          return { ...msg, status: "delivered" };
        }
        return msg;
      });
      setMessages(updatedMessages);
    };

    props.socket?.on("messageDelivered", handleDelivery);
    return () => {
      props.socket?.off("messageDelivered", handleDelivery);
    };
  }, [messages, props.socket]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      setIsAtBottom(
        container.scrollHeight - container.scrollTop === container.clientHeight
      );
    }
  };

  const handleNewMessageClick = () => {
    setShowNewMessageButton(false);
    scrollToBottom(); // Scroll to the bottom when clicking on "New Message" button
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        ref={messagesContainerRef}
        onScroll={handleScroll} // Handle scroll events
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
              <Stack direction="row" spacing={1} alignItems="center">
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
                  <DoneIcon sx={{ color: "gray", fontSize: 20 }} />
                )}
                {msg.sender === "user" && msg.status === "delivered" && (
                  <DoneAllIcon sx={{ color: "gray", fontSize: 20 }} />
                )}
                {msg.sender === "user" && msg.status === "read" && (
                  <DoneAllIcon sx={{ color: "green", fontSize: 20 }} />
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
            setEditor={(editor) => (editorRef.current = editor)} // Get the editor instance
          />
        </form>
      </Box>
    </>
  );
}
