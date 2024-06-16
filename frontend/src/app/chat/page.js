"use client";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Container, Paper } from "@mui/material";

const drawerWidth = 300;

export default function PermanentDrawerLeft() {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 100% width for mobile devices
            sm: "10% 30% 1fr", // Default layout for larger devices
          },
          gridTemplateRows: {
            xs: "repeat(5, auto)", // Auto height for each item in mobile view
            sm: "10% 30% 1fr", // Default layout for larger devices
          },
          gap: 3,
          height: "100%",
          p: 3,
        }}
      >
        {/* The side bar */}
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
          }}
        >
          hello
        </Paper>
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
      </Box>
    </>
  );
}
