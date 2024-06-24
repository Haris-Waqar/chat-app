import { Paper } from "@mui/material";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { Search } from "@mui/icons-material";
import { Typography } from "@mui/material";

export default function ChatsList() {
  return (
    <Paper
      elevation={3}
      sx={{
        gridColumn: {
          xs: "1", // Full width in mobile view
          sm: "2",
        },
        gridRow: {
          xs: "2", // Second item in mobile view
          sm: "1 / 4", // Span the rows previously occupied by Search Bar and Groups
        },
        borderRadius: "16px",
        p: 2,
      }}
    >
      {/* Chats Heading */}
      <Typography
        variant="h6"
        sx={{
          p: "5px",
          fontWeight: "bold",
        }}
      >
        Chats
      </Typography>

      {/* Seacrh Bar */}
      <TextField
        id="input-with-icon-textfield"
        variant="outlined"
        fullWidth="true"
        placeholder="Search"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            maxHeight: "32px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
}
