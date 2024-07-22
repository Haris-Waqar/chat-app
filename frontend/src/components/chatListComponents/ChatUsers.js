"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";
import { setUsers, setSelectedUser } from "@/store/slices/UserSlice.js";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export default function ChatUsers(props) {
  const users = useAppSelector((state) => state.user.users);
  const dispatch = useAppDispatch();
  const { user, onlineUsers } = useAuth(); // Assuming onlineUsers state is available in useAuth()
  const [lastMessages, setLastMessages] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // fetch all users and set the state
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
    // Update filteredUsers after users are fetched
    if (users) {
      const filtered = users.filter((userObj) => userObj._id !== user._id);
      setFilteredUsers(filtered);
    }
  }, [users, user._id]);

  useEffect(() => {
    // fetch last messages for each user
    const fetchLastMessages = async () => {
      try {
        const promises = filteredUsers.map(async (userObj) => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/lastMessage/${user._id}/${userObj._id}`
          );
          console.log({ userId: userObj._id, lastMessage: res.data });
          return { userId: userObj._id, lastMessage: res.data };
        });

        const results = await Promise.all(promises);
        const messages = results.reduce((acc, curr) => {
          acc[curr.userId] = curr.lastMessage;
          return acc;
        }, {});

        setLastMessages(messages);
      } catch (error) {
        console.log(error);
      }
    };

    if (filteredUsers.length > 0) {
      fetchLastMessages();
    }
  }, [filteredUsers, user._id]);

  const openChat = (user) => {
    // Open chat with the user
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
              {/* Avatar and Name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt={userObj.username}
                  src={userObj.profilePicture}
                  sx={{ width: 40, height: 40, position: "relative" }} // Ensure relative positioning for the Avatar
                />
                {/* Green or Red Dot */}
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
                {/* End of Green or Red Dot */}
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
                    {lastMessages[userObj._id]?.message || "No messages yet"}
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
