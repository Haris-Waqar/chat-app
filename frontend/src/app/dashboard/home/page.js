import { Paper } from "@mui/material";

export default function HomePage() {
  return (
    <>
      {" "}
      {/* Search Bar */}
      <Paper
        elevation={3}
        sx={{
          gridColumn: {
            xs: "1", // Full width in mobile view
            sm: "2/4",
          },
          gridRow: {
            xs: "2", // Second item in mobile view
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
