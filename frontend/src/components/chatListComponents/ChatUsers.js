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
  const { user } = useAuth();
  console.log("socket status from chat user component ::", props.socket);

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
  }, []); // The dependency array is empty to avoid re-fetching on every render

  const openChat = (user) => {
    // Open chat with the user
    dispatch(setSelectedUser(user));
  };

  //   Filter users to exclude the user
  const filteredUsers = users?.filter((userObj) => {
    return userObj._id != user._id;
  });

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
                  sx={{ width: 40, height: 40 }}
                />
                <Box
                  sx={{
                    ml: 1,
                    textTransform: "capitalize",
                    fontWeight: "600",
                  }}
                >
                  <h4>{userObj.username}</h4>
                </Box>
              </Box>
            </Box>
            <Divider orientation="horizontal" />
          </Box>
        ))}
    </>
  );
}
