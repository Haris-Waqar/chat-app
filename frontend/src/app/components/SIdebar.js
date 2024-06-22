import { Paper } from "@mui/material";
import Box from "@mui/material/Box";

import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Sidebar() {
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
          p: 2,
          bgcolor: "#6E00FF",
        }}
      >
        <Avatar
          sx={{ bgcolor: "text.primary" }}
          alt="Remy Sharp"
          src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
        />

        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
            onClick={() => {
              alert("clicked");
            }}
          >
            <Image src="/home.png" width={30} height={42} alt="home icon" />
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
