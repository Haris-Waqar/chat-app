import ChatArea from "@/components/ChatArea.js";
import ChatsList from "@/components/ChatsList";
import { Paper } from "@mui/material";

export default function MainChatPage() {
  return (
    <>
      {/* People (Chats List) */}
      <ChatsList />
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
        <ChatArea />
      </Paper>
    </>
  );
}
