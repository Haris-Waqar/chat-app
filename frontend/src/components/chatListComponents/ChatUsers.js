"use client";
import { useRef, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";
import {
  setUsers,
  setSelectedUser,
  setLastMessages,
} from "@/store/slices/UserSlice.js";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export default function ChatUsers(props) {
  const users = useAppSelector((state) => state.user.users);
  const lastMessages = useAppSelector((state) => state.user.lastMessages);
  const dispatch = useAppDispatch();
  const { user, onlineUsers } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllUsers`
        );
        dispatch(setUsers(res.data.users));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      const filtered = users.filter((userObj) => userObj._id !== user._id);
      setFilteredUsers(filtered);
    }
  }, [users, user._id]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const promises = filteredUsers.map(async (userObj) => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/lastMessage/${user._id}/${userObj._id}`
          );
          return { userId: userObj._id, lastMessage: res.data };
        });

        const results = await Promise.all(promises);
        const messages = results.reduce((acc, curr) => {
          acc[curr.userId] = curr.lastMessage;
          return acc;
        }, {});

        dispatch(setLastMessages(messages));
      } catch (error) {
        console.log(error);
      }
    };

    if (filteredUsers.length > 0) {
      fetchLastMessages();
    }
  }, [filteredUsers, user._id, dispatch]);

  const openChat = (user) => {
    dispatch(setSelectedUser(user));
  };

  const isUserOnline = (userId) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  return (
    <>
      {filteredUsers &&
        filteredUsers.map((userObj) => (
          <Box key={userObj._id} onClick={() => openChat(userObj)}>
            <Box
              key={userObj._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  cursor: "pointer",
                },
                mt: 1,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt={userObj.username}
                  src={userObj.profilePicture}
                  sx={{ width: 40, height: 40, position: "relative" }}
                />
                {isUserOnline(userObj._id) ? (
                  <span
                    style={{
                      position: "absolute",
                      left: "38px",
                      top: "9px",
                      border: " 1.5px solid white",
                      background: "green",
                      borderRadius: "100%",
                      height: "9px",
                      width: "9px",
                    }}
                  ></span>
                ) : (
                  <span
                    style={{
                      position: "absolute",
                      left: "38px",
                      top: "9px",
                      border: " 1.5px solid white",
                      background: "red",
                      borderRadius: "100%",
                      height: "9px",
                      width: "9px",
                    }}
                  ></span>
                )}
                <Box
                  sx={{
                    ml: 1,
                    textTransform: "capitalize",
                    fontWeight: "600",
                  }}
                >
                  <h4>{userObj.username}</h4>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      textTransform: "none",
                      color: "gray",
                      fontWeight: "400",
                    }}
                  >
                    {lastMessages[userObj._id]?.message ||
                      lastMessages[userObj._id] ||
                      "No messages yet"}
                  </p>
                </Box>
              </Box>
            </Box>
            <Divider orientation="horizontal" />
          </Box>
        ))}
    </>
  );
}
