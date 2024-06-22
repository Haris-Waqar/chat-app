import { Paper } from "@mui/material";

export default function MainChatPage() {
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
      {/* Groups */}
      <Paper
        elevation={3}
        sx={{
          gridColumn: {
            xs: "1", // Full width in mobile view
            sm: "2",
          },
          gridRow: {
            xs: "3", // Third item in mobile view
            sm: "2 / 3",
          },
          borderRadius: "16px",
          p: 2,
        }}
      >
        hello
      </Paper>
      {/* People */}
      <Paper
        elevation={3}
        sx={{
          gridColumn: {
            xs: "1", // Full width in mobile view
            sm: "2",
          },
          gridRow: {
            xs: "4", // Fourth item in mobile view
            sm: "3 / 4",
          },
          borderRadius: "16px",
          p: 2,
        }}
      >
        hello
      </Paper>
      {/* Chat Area */}
      <Paper
        elevation={3}
        sx={{
          gridColumn: {
            xs: "1", // Full width in mobile view
            sm: "3",
          },
          gridRow: {
            xs: "5", // Fifth item in mobile view
            sm: "1 / 4",
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
