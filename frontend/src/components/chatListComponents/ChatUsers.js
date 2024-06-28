"use client";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ChatUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // fetch all users and set the state
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllUsers`
        );
        setUsers(res.data.users); // Assuming the response has a 'users' property
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []); // The dependency array is empty to avoid re-fetching on every render

  console.log("users", users);

  return (
    <>
      {users &&
        users.map((userObj) => (
          <Box
            key={userObj.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#f5f5f5",
                cursor: "pointer",
              },
            }}
          >
            <Avatar
              alt={userObj.username}
              src={userObj.profilePicture}
              sx={{ width: 40, height: 40 }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                ml: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h4>{userObj.username}</h4>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
    </>
  );
}
