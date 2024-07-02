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
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    // loop through all users and emit addNewUser to connect to the socket all users
    if (socket && user) {
      console.log("AddNewUser emit works");
      //   users?.forEach((user) => {
      //     socket.emit("addNewUser", user._id);
      //   });
      socket.emit("addNewUser", user._id);
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
