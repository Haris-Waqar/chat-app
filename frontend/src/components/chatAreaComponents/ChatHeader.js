import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Divider from "@mui/material/Divider";

export default function ChatHeader() {
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
            <Box>John</Box>
            <Box>
              <span>Online -Last Seen, 2:02 pm</span>
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
              >
                <Image
                  key={index}
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
