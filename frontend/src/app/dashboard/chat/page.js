import { Paper } from "@mui/material";

export default function ChatPage() {
  return (
    <>
      {/* Search Bar */}
      <Paper
        elevation={3}
        sx={{
          gridColumn: {
            xs: "1", // Full width in mobile view
            sm: "2",
          },
          gridRow: {
            xs: "2", // Second item in mobile view
            sm: "1 / 2",
          },
          borderRadius: "16px",
          p: 2,
        }}
      >
        hello
      </Paper>
    </>
  );
}
