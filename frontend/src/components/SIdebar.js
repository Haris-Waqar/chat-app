import { Paper } from "@mui/material";
import Box from "@mui/material/Box";

import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const sideBarIcons = [
    {
      name: "Home",
      icon: "/home.svg",
      link: "/dashboard/home",
    },
    {
      name: "Chat",
      icon: "/chat.svg",
      link: "/dashboard",
    },
    {
      name: "Notifications",
      icon: "/notifications.svg",
      link: "/dashboard/notifications",
    },

    {
      name: "Settings",
      icon: "/settings.svg",
      link: "/dashboard/settings",
    },
  ];
  const pathname = usePathname();
  const isActive = (link) => {
    return link == pathname;
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          gridColumn: {
            xs: "1", // Full width in mobile view
            sm: "1",
          },
          gridRow: {
            xs: "1", // First item in mobile view
            sm: "1 / 4",
          },
          borderRadius: "16px",
          py: 2,
          bgcolor: "#6E00FF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "text.primary",
            }}
            alt="Avatar"
            src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100% - 50px)",
          }}
        >
          <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
            {sideBarIcons.map((icons, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    padding: "10px",

                    "&:hover": {
                      bgcolor: "#612DD1",
                    },
                    bgcolor: isActive(icons.link) ? "#612DD1" : "transparent",
                    borderRight: isActive(icons.link)
                      ? "5px solid #F3B559"
                      : "none",
                  }}
                  onClick={() => {
                    router.push(icons.link);
                  }}
                >
                  <Image
                    src={icons.icon}
                    width={30}
                    height={42}
                    alt={icons.name}
                  />
                </Box>
              );
            })}
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              cursor: "pointer",
              padding: "10px",

              "&:hover": {
                bgcolor: "#612DD1",
              },
              bgcolor: isActive("/") ? "#612DD1" : "transparent",
              borderRight: isActive("/") ? "5px solid #F3B559" : "none",
              mt: "auto",
            }}
            onClick={() => {
              router.push("/login");
              //   clear local storage
              localStorage.clear();
            }}
          >
            <Image src="/logout.svg" width={30} height={42} alt="logout" />
          </Box>
        </Box>
      </Paper>
    </>
  );
}
