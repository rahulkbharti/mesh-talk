import React, { useState, useEffect, useRef, use } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
  useTheme,
  ThemeProvider,
  Avatar,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  useMediaQuery,
  createTheme,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import InterestsIcon from "@mui/icons-material/Interests";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ChatIcon from "@mui/icons-material/Chat";

import { Link } from "react-router-dom";
import useWebRTC from "../hooks/useWebRTC";

const SOCKET_SERVER = import.meta.env.VITE_BACKEND;
// Reuse the same theme from landing page
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const userData = {
  username: "John",
  chatType: "video",
  name: "Alex Johnson",
  age: 28,
  location: "15 miles away",
  bio: "Love exploring new places and meeting interesting people. Let's connect!",
  avatar: "AJ",
  interests: ["test"],
};

const ConnectionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [message, setMessage] = useState("");
  // const [status, setStatus] = useState("idle"); // 'idle', 'connecting', 'matched', 'connected', 'disconnected', 'error'
  //   const [messages, setMessages] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connected, setConnected] = useState(false);
  const [peerInfo, setPeerInfo] = useState(null);
  const [openInterestsDialog, setOpenInterestsDialog] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [interests, setInterests] = useState(["Technology", "Travel", "Music"]);
  const videoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  // WEBRTC
  const {
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    sendMessage,
    messages,
    status,
    partnerInfo,
  } = useWebRTC(SOCKET_SERVER, userData);

  // console.log("status", status);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest)) {
      setInterests((prev) => [...prev, newInterest]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests((prev) => prev.filter((i) => i !== interestToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    endCall(); // Ensure to clean up the WebRTC connection
  };
  const handleSkip = async () => {
    // If currently connected, end the call first
    if (connected) {
      endCall(); // Make sure to implement this function to clean up connections
      setConnected(false);

      // Wait for 1 second before starting new connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Start new connection
    startCall(); // Implement this function to initiate new connection

    // Simulate connection after a brief delay (like real connection would take)
    setTimeout(() => {
      setConnected(true);
    }, 500);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", py: 1 }}
          >
            {/* Left Side - Logo */}
            <Link to="/">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  SC
                </Avatar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  StrangerConnect
                </Typography>
              </Box>
            </Link>

            {/* Right Side - Online Users */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {status === "connected" && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<CloseIcon />}
                  onClick={handleDisconnect}
                  sx={{ textTransform: "none" }}
                >
                  Disconnect
                </Button>
              )}
              <Chip
                //   icon={<PeopleIcon fontSize="small" />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {/* {onlineUsers.toLocaleString()} online now */}
                  </Typography>
                }
                sx={{
                  bgcolor: theme.palette.primary.dark,
                  color: "white",
                  px: 1,
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              {/* <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Join Now
              </Button> */}
            </Box>
          </Toolbar>
        </Container>

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            py: 3,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
          }}
        >
          {/* Video/Connection Area */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Video Container */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                borderRadius: 2,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "hidden",
                minHeight: isMobile ? "200px" : "400px",
              }}
            >
              {/* Video Element */}

              {/* Peer Video */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "background.default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid black",
                  visibility: status === "connected" ? "visible" : "hidden",
                }}
              >
                <Box
                  component={"video"}
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ display: status === "connecting" ? "block" : "none" }}
                  >
                    Peer Video Stream
                  </Typography> */}

                {/* In a real app, you would use: */}
                {/* <video ref={peerVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
              </Box>

              {/* My Video (Picture-in-picture) */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  width: isMobile ? "100px" : "150px",
                  height: isMobile ? "75px" : "112px",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: `2px solid ${theme.palette.primary.main}`,
                  visibility: status === "connected" ? "visible" : "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component={"video"}
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muteds
                    style={{
                      // display: status === "connected" ? "flex" : "none",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* <Typography variant="caption" color="text.secondary">
                        My Video
                      </Typography> */}
                  {/* In a real app: */}
                  {/* <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
                </Box>
              </Box>

              {/* Connecting Logo */}
              {status !== "connected" && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: `2px solid ${theme.palette.primary.main}`,
                    visibility: status !== "connected" ? "visible" : "hidden",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.main",
                      mb: 2,
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" align="center">
                    {{
                      idle: "Ready to meet someone new? Let’s find your vibe match 🔍",
                      connecting: "Looking for someone to connect with...",
                      connected: "Boom! You’re now connected 🎉",
                      disconnected: "The other person has left the chat 😔",
                    }[status] || "Status unknown"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {{
                      idle: "Chillin’ for now. Hit Start when you’re ready to connect ✨",
                      connecting: `We're finding someone who shares your interests: ${interests.join(
                        ", "
                      )}`,
                      connected: "Say hi and see where the convo takes you 👋",
                      disconnected:
                        "Wanna try connecting with someone else? 🔁",
                    }[status] || ""}
                  </Typography>
                </Box>
              )}
            </Paper>
            {/* Controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                py: 1,
              }}
            >
              <Tooltip
                title={videoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                <IconButton
                  color={videoEnabled ? "primary" : "default"}
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  sx={{
                    bgcolor: videoEnabled ? "primary.dark" : "background.paper",
                    "&:hover": {
                      bgcolor: videoEnabled
                        ? "primary.dark"
                        : "background.paper",
                    },
                  }}
                >
                  {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip
                title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                <IconButton
                  color={audioEnabled ? "primary" : "default"}
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  sx={{
                    bgcolor: audioEnabled ? "primary.dark" : "background.paper",
                    "&:hover": {
                      bgcolor: audioEnabled
                        ? "primary.dark"
                        : "background.paper",
                    },
                  }}
                >
                  {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<InterestsIcon />}
                onClick={() => setOpenInterestsDialog(true)}
                sx={{ textTransform: "none" }}
              >
                My Interests
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<SkipNextIcon />}
                onClick={handleSkip}
                sx={{ textTransform: "none" }}
              >
                Skip
              </Button>
            </Box>
          </Box>

          {/* Chat/Info Area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: isMobile ? "100%" : "300px",
              height: isMobile ? "auto" : "calc(100vh - 100px)",
              overflow: "hidden",
            }}
          >
            {/* Peer Info Card */}
            {status === "connected" && partnerInfo && (
              <Accordion
                defaultExpanded
                sx={{
                  "&.MuiAccordion-root": {
                    backgroundColor: "background.paper",
                    borderRadius: "16px !important",
                    overflow: "hidden",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <PersonIcon color="primary" />
                    About Your Connection
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name:
                      </Typography>
                      <Typography>{partnerInfo?.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Age:
                      </Typography>
                      <Typography>{partnerInfo?.age}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        From:
                      </Typography>
                      <Typography>{partnerInfo?.country}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Gender:
                      </Typography>
                      <Typography>{partnerInfo?.gender}</Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Interests:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {partnerInfo?.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Chat Box */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                borderRadius: 2,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                minHeight: isMobile ? "300px" : 0,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Chat</Typography> - {status}
              </Box>

              {/* Messages */}
              <Box
                ref={chatContainerRef}
                sx={{
                  flex: 1,
                  p: 2,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <Box
                      key={index}
                      sx={{
                        alignSelf:
                          msg.sender === "You" ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor:
                            msg.sender === "You"
                              ? "primary.dark"
                              : "background.default",
                          borderRadius: 2,
                          borderTopLeftRadius: msg.sender === "You" ? 2 : 0,
                          borderTopRightRadius: msg.sender === "You" ? 0 : 2,
                        }}
                      >
                        <Typography>{msg.text}</Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            textAlign: msg.sender === "You" ? "right" : "left",
                            mt: 0.5,
                          }}
                        >
                          {msg?.timestamp?.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      p: 3,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {connected
                        ? "Say hello to your new connection!"
                        : "You'll be able to chat once connected"}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Message Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  gap: 1,
                }}
              >
                <TextField
                  disabled={status !== "connected"}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || status !== "connected"}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Interests Dialog */}
      <Dialog
        open={openInterestsDialog}
        onClose={() => setOpenInterestsDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <InterestsIcon sx={{ mr: 1 }} />
          My Interests
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Add or update your interests to match with like-minded people
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Add new interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleAddInterest}
              disabled={!newInterest.trim()}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Your Current Interests:
          </Typography>

          {interests.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  onDelete={() => handleRemoveInterest(interest)}
                  color="primary"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No interests added yet
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenInterestsDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ConnectionPage;
