"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && Object.keys(user).length) {
      // Redirect to dashboard if user is authenticated
      router.push("/dashboard");
    } else {
      // Redirect to login if user is not authenticated
      router.push("/login");
    }
  }, [user, router]); // Add user and router as dependencies

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
