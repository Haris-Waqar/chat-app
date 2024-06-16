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
      <Container sx={{ height: "100%", mx: 1, pl: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "10% 30% 60%",
            gridTemplateRows: "10% 30% 1fr",
            gap: 3,
            height: "100%",
            p: 2,
          }}
        >
          {/* The side bar */}
          <Paper
            elevation={3}
            sx={{
              gridColumn: "1",
              gridRow: "1 / 4",
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
              gridColumn: "2",
              gridRow: "1 / 2",
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
              gridColumn: "2",
              gridRow: "2/ 3",
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
              gridColumn: "2",
              gridRow: "3/ 4",
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
              gridColumn: "3",
              gridRow: "1/ 4",
              borderRadius: "16px",
              p: 2,
            }}
          >
            hello
          </Paper>
        </Box>
      </Container>
    </>
  );
}
