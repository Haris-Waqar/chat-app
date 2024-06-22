"use client";
import { Box, Paper } from "@mui/material";
import Sidebar from "@/components/SIdebar.js";

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <section>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 100% width for mobile devices
            sm: "5% 30% 1fr", // Default layout for larger devices
          },
          gridTemplateRows: {
            xs: "repeat(5, auto)", // Auto height for each item in mobile view
            sm: "10% 30% 1fr", // Default layout for larger devices
          },
          gap: 3,
          height: "100vh",
          p: 3,
        }}
      >
        <Sidebar />
        {children}
      </Box>
    </section>
  );
}
