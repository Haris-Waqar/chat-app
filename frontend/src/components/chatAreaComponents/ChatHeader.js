"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks.js";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import { useAuth } from "@/contexts/AuthContext";

export default function ChatHeader() {
  const selectedUser = useAppSelector((state) => state.user.selectedUser);
  const { onlineUsers } = useAuth();

  const chatHeaderMenu = [
    {
      icon: "/phone.svg",
      name: "phone",
    },
    {
      icon: "/camera.svg",
      name: "camera",
    },
    {
      icon: "/settingsIcon.svg",
      name: "camera",
    },
  ];
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        {/* Section for Avatar, Name , Online, Last Seen  */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "text.primary",
            }}
            alt="Avatar"
            src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
          />
          <Box>
            <Box
              sx={{
                fontSize: "1.2rem",
                fontWeight: "600",
                textTransform: "capitalize",
                color: "text.primary",
              }}
            >
              {selectedUser?.username
                ? selectedUser.username.charAt(0).toUpperCase() +
                  selectedUser.username.slice(1).toLowerCase()
                : ""}
            </Box>

            <Box
              sx={{
                fontSize: "0.8rem",
                color: "text.secondary",
                fontWeight: "500",
              }}
            >
              {onlineUsers.some((user) => user.userId === selectedUser?._id)
                ? "Online"
                : "Offline"}
            </Box>
          </Box>
        </Box>
        {/* Section for icons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxHeight: "25px",
            gap: 4,
          }}
        >
          {chatHeaderMenu.map((menuItem, index) => {
            return (
              <Box
                sx={{
                  cursor: "pointer",
                }}
                key={index}
                x
              >
                <Image
                  src={menuItem.icon}
                  width={menuItem.icon == "/settingsIcon.svg" ? "5" : "20"}
                  height={20}
                  alt={menuItem.name}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
      <Divider orientation="horizontal" />
    </>
  );
}
