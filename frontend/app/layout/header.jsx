import React from "react";
import { Box, Typography } from "@mui/material";

const Header = ({ onlineUsers = 0, availableUsers = 0 }) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "34px", // Fixed height
                background: "rgba(255, 255, 255, 0.8)", // Light background
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                padding: "0 10px", // Reduced padding
                borderRadius: "6px",
                color: "#000", // Black text color
                fontWeight: "bold",
            }}
        >
            {/* Left Section - App Name */}
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: "600",
                    fontSize: "0.9rem", // Smaller font size
                }}
            >
                🔴 Real-Time Video Chat
            </Typography>

            {/* Middle Section - Tagline */}
            <Typography
                variant="caption"
                sx={{
                    fontStyle: "italic",
                    fontSize: "0.8rem", // Adjusted smaller font
                }}
            >
                Talk to a Stranger, Make New Friends!
            </Typography>

            {/* Right Section - User Counts */}
            <Box sx={{ textAlign: "right" }}>
                <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", fontSize: "0.8rem" }}
                >
                    🌍 Online: {onlineUsers}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        color: "#008000",
                    }}
                >
                    ✅ Available: {availableUsers}
                </Typography>
            </Box>
        </Box>
    );
};

export default Header;
