"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";
import PlaceHolderMessagingArea from "@/components/chatAreaComponents/PlaceHolderMessagingArea.js";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import ChatHeader from "@/components/chatAreaComponents/ChatHeader.js";
import MessagingArea from "@/components/chatAreaComponents/MessagingArea.js";

export default function ChatArea() {
  const selectedUser = useAppSelector((state) => state.user.selectedUser);
  const [socket, setSocket] = useState(null);
  const { user, setOnlineUsers } = useAuth();

  useEffect(() => {
    const newSocket = io("https://chat-app-production-d90f.up.railway.app", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      console.log("AddNewUser emit works");

      socket.emit("addNewUser", user._id);
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [socket]);

  console.log("socket status in chat area===>>", socket);
  return (
    <>
      {!selectedUser ? (
        <PlaceHolderMessagingArea />
      ) : (
        <>
          <ChatHeader socket={socket} />
          <MessagingArea socket={socket} />
        </>
      )}
    </>
  );
}
ChatHeader;
