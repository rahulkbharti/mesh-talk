import React, { useState, useEffect, useRef } from "react";
import { Container, Paper, Grid2 as Grid, Button, TextField, IconButton, Box, Typography, Stack } from "@mui/material";
// import Grid from "@mui/material-next/Grid2"; // ✅ Using MUI Grid v2
import { VideocamOff, MicOff, Send, Call, CallEnd } from "@mui/icons-material";
import { useSelector } from 'react-redux';
import useWebRTC from "../hooks/useWebRTC";

const userData = { username: "John", interests: ["tech", "gaming"], chatType: "video" };
const SOCKET_SERVER = import.meta.env.VITE_BACKEND;

const VideoChat = () => {
  const interests = useSelector((state) => state.intrest.intrest);
  userData.interests = interests;

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([
  //   { text: "Hello! How are you?", sender: "remote" },
  //   { text: "I'm good! How about you?", sender: "local" },
  //   { text: "Doing great! Let's start the call.", sender: "remote" },
  // ]);
  const { localVideoRef, remoteVideoRef, startCall, endCall, sendMessage, message: messages } = useWebRTC(SOCKET_SERVER, userData);
  const chatRef = useRef(null);

  useEffect(() => {
    // Scroll to the latest message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* Video Section (Local + Remote) */}
        <Grid size={6}>
          <Stack spacing={2} height={615}>
            {/* Local Video */}
            <Paper elevation={3} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", background: "#fff" }}>
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton onClick={() => setVideoOff(!videoOff)} color="secondary">
                  <VideocamOff />
                </IconButton>
                <IconButton onClick={() => setMuted(!muted)} color="secondary">
                  <MicOff />
                </IconButton>
              </Box>
              <video ref={localVideoRef} style={{ width: "100%", height: "100%", display: videoOff ? "none" : "block", transform: "scaleX(-1)" }} autoPlay muted={muted} />
            </Paper>

            {/* Remote Video */}
            <Paper elevation={3} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", background: "#fff" }}>
              {/* <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton onClick={() => setVideoOff(!videoOff)} color="secondary">
                  <VideocamOff />
                </IconButton>
                <IconButton onClick={() => setMuted(!muted)} color="secondary">
                  <MicOff />
                </IconButton>
              </Box> */}
              <video ref={remoteVideoRef} style={{ width: "100%", height: "100%", display: videoOff ? "none" : "block" }} autoPlay muted={muted} />
            </Paper>
          </Stack>
        </Grid>

        {/* Chat Section */}
        <Grid size="grow">
          <Paper elevation={3} sx={{ minHeight: 300, height: 615, display: "flex", flexDirection: "column", borderRadius: 2 }}>
            {/* Chat Messages (Scrollable) */}
            <Box sx={{ p: 1, backgroundColor: "#f5f5f5", borderRadius: "8px 8px 0 0" }}>
              <Typography variant="h6">Chat</Typography>
            </Box>
            <Box ref={chatRef} sx={{ flex: 1, overflowY: "auto", p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px 8px 0 0" }}>
              {messages.map((msg, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: msg.role === "You" ? "flex-end" : "flex-start", mb: 1 }}>
                  <Typography
                    sx={{
                      maxWidth: "75%",
                      p: 1.5,
                      borderRadius: msg.role === "You" ? "15px 15px 0px 15px" : "15px 15px 15px 0px",
                      background: msg.role === "You" ? "#1976d2" : "#e0e0e0",
                      color: msg.role === "You" ? "#fff" : "#000",
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.message}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Message Input (Fixed at Bottom) */}
            <Box sx={{ p: 2, borderTop: "1px solid #ddd", display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "0 0 8px 8px" }}>

              <TextField
                fullWidth
                id="filled-multiline-flexible"
                label="Enter your message"
                // multiline
                maxRows={4}
                variant="filled"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <IconButton color="primary" sx={{ ml: 1 }} onClick={handleSendMessage}>
                <Send />
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        {/* Call Controls */}
        <Grid size={12} sx={{ textAlign: "center", mt: 2 }}>
          <Button onClick={startCall} variant="contained" color="success" startIcon={<Call />} sx={{ mr: 2, px: 3, borderRadius: 2, fontSize: "1rem" }}>
            Start Call
          </Button>
          <Button onClick={endCall} variant="contained" color="error" startIcon={<CallEnd />} sx={{ px: 3, borderRadius: 2, fontSize: "1rem" }}>
            End Call
          </Button>
        </Grid>

      </Grid>
    </Container>
  );
};

export default VideoChat;
