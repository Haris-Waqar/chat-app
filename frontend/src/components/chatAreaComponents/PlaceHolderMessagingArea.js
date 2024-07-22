import { Box } from "@mui/material";
import Image from "next/image";

export default function PlaceHolderMessagingArea() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image src="/placeholder.svg" width={30} height={42} alt="placeholder" />
      <Box
        sx={{
          fontSize: "1.5rem",
          ml: 2,
        }}
      >
        Send messages to your friends
      </Box>
    </Box>
  );
}
