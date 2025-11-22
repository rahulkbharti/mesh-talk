import { useState, useEffect, useRef, use } from "react";
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
  Divider,
  Tooltip,
  useMediaQuery,
  createTheme,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  GlobalStyles,
  AppBar,
  Fade,
  Slide,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
// import PersonIcon from "@mui/icons-material/Person";
import InterestsIcon from "@mui/icons-material/Interests";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";

import { Link } from "react-router-dom";
import useWebRTC from "../hooks/useWebRTC";
// import { generateUsername } from "../utils/randomUserNameGenerator";
import { useSelector, useDispatch } from "react-redux";
import { addInterest, removeInterest } from "../modules/intrest/intrestSlice";
import FloatingHearts from "../components/FloatingHearts";
import darkPinkLoveTheme from "../utils/theme";

const SOCKET_SERVER = import.meta.env.VITE_BACKEND;

const ConnectionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [message, setMessage] = useState("");
  const [openInterestsDialog, setOpenInterestsDialog] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);

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
    toggleAudio,
    toggleVideo,
    isAudio,
    isVideo,
    onlineUsers
  } = useWebRTC(SOCKET_SERVER, userData);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleDisconnect = () => {
    endCall(); // Ensure to clean up the WebRTC connection
  };

  // handle Connect
  const handleConnect = () => {
    if (status === "matching" || status === "matched") {
      endCall();
      return;
    }
    startCall(); // Implement this function to initiate new connection

    // Simulate connection after a brief delay (like real connection would take)
    setTimeout(() => { }, 500);
  };

  const handleSkip = async () => {
    // If currently connected, end the call first
    if (status === "connected" || status === "connecting") {
      endCall(); // Make sure to implement this function to clean up connections

      // Wait for 1 second before starting new connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Start new connection
    startCall(); // Implement this function to initiate new connection
  };
  return (
    <ThemeProvider theme={darkPinkLoveTheme}>
      <CssBaseline />
      {/* <GlobalStyles styles={floatingHeartsAnimation} /> */}
      <FloatingHearts />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}

        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            pt: 2,
            px: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Toolbar sx={{ p: '0 !important', justifyContent: "space-between" }}>
              {/* Left Side - Logo */}
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <FavoriteIcon />
                  </Avatar>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      display: { sm: 'block' },
                    }}
                  >
                    MeshTalk
                  </Typography>
                </Box>
              </Link>

              <Box sx={{ flexGrow: 1 }} />

              {/* Right Side - Status & Home Button */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {onlineUsers > 0 ? (
                  <Chip
                    icon={<FavoriteIcon fontSize="small" sx={{ color: "primary.main" }} />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {/* {{
                        idle: "Ready",
                        connecting: "Searching...",
                        matched: "Found someone!",
                        connected: "Connected ❤️",
                        "socket-disconnected": "Disconnected",
                        "peer-disconnected": "Disconnected",
                        "socket-error": "Error",
                        "peer-error": "Error",
                      }[status] || "Ready"} */}
                        {onlineUsers} user{onlineUsers !== 1 ? "s" : ""} online
                      </Typography>
                    }
                    sx={{
                      bgcolor: "rgba(233, 30, 99, 0.1)",
                      color: "primary.main",
                      border: "1px solid",
                      borderColor: "primary.main",
                      px: 1,
                      display: { sm: 'flex' },
                    }}
                  />
                ) : (
                  <Chip label="Connecting..." sx={{
                    bgcolor: "rgba(95, 11, 39, 0.1)",
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "primary.main",
                    px: 1,
                    display: { sm: 'flex' },
                  }} />
                )}

                <Tooltip title="Back to Home">
                  <IconButton
                    component={Link}
                    to="/"
                    sx={{
                      color: "primary.main",
                      "&:hover": { bgcolor: "rgba(233, 30, 99, 0.1)" },
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>        {/* Main Content */}
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
              height: isMobile ? "400px" : "calc(100vh - 100px)",
              overflow: "hidden",
            }}
          >
            {/* Video Container */}
            <Paper
              elevation={6}
              sx={{
                flex: 1,
                borderRadius: 4,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "hidden",
                minHeight: isMobile ? "250px" : "400px",
                border: status === "connected" ? "3px solid" : "1px solid",
                borderColor: status === "connected" ? "primary.main" : "divider",
                boxShadow: status === "connected"
                  ? "0 8px 32px rgba(233, 30, 99, 0.3)"
                  : "0 4px 16px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Peer Video */}
              <Fade in={status === "connected"} timeout={500}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "background.default",
                    display: status === "connected" ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
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
                </Box>
              </Fade>

              {/* My Video (Always visible) */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  width: isMobile ? "100px" : "200px",
                  height: isMobile ? "75px" : "150px",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: `3px solid`,
                  borderColor: "secondary.main",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                  zIndex: 10,
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
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
                    // border: `2px solid ${theme.palette.primary.main}`,
                    visibility: status !== "connected" ? "visible" : "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 250, md: 350 },
                      height: { xs: 250, md: 350 },
                      backgroundImage:
                        "url('https://media.tenor.com/ffG8ZgTeQ74AAAAj/peach-and-goma-cute.gif')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Optional content here */}
                  </Box>
                  <Typography variant="h6" align="center">
                    {{
                      idle: "Ready to meet someone new? Let’s find your vibe match 🔍",
                      connecting: "Looking for someone to connect with...",
                      matched: "Connecting to your match...",
                      connected: "Boom! You’re now connected 🎉",
                      "peer-disconnected": "Your match has left the chat 😔",
                      "socket-disconnected": "You've been disconnected. Check your internet.",
                      "peer-error": "A connection error occurred.",
                      "socket-error": "Could not connect to the server.",
                    }[status] || "Server sleep refresh and wait a while"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {{
                      idle: "Chillin’ for now. Hit Start when you’re ready to connect ✨",
                      connecting: `We're finding someone who shares your interests: ${userData?.interests.join(
                        ", "
                      )}`,
                      matched: "Getting things ready for your chat!",
                      connected: "Say hi and see where the convo takes you 👋",
                      "peer-disconnected":
                        "Wanna try connecting with someone else? 🔁",
                      "socket-disconnected": "Please refresh or try connecting again.",
                      "peer-error": "Please try connecting again.",
                      "socket-error": "Please try again in a moment.",
                    }[status] || ""}
                  </Typography>
                </Box>
              )}
            </Paper>
            {/* Controls */}
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 3,
              }}
            >
              <Tooltip title={isVideo ? "Turn off camera" : "Turn on camera"}>
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    bgcolor: isVideo ? "primary.main" : "background.default",
                    color: isVideo ? "white" : "text.secondary",
                    width: { xs: 45, sm: 50 },
                    height: { xs: 45, sm: 50 },
                    "&:hover": {
                      bgcolor: isVideo ? "primary.dark" : "action.hover",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {isVideo ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isAudio ? "Mute microphone" : "Unmute microphone"}>
                <IconButton
                  onClick={toggleAudio}
                  sx={{
                    bgcolor: isAudio ? "primary.main" : "background.default",
                    color: isAudio ? "white" : "text.secondary",
                    width: { xs: 45, sm: 50 },
                    height: { xs: 45, sm: 50 },
                    "&:hover": {
                      bgcolor: isAudio ? "primary.dark" : "action.hover",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {isAudio ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<InterestsIcon />}
                onClick={() => setOpenInterestsDialog(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 3,
                  px: { xs: 2, sm: 3 },
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(255, 128, 171, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(255, 128, 171, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {isMobile ? "Interests" : "My Interests"}
              </Button>

              {status === "connected" && (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<SkipNextIcon />}
                    onClick={handleSkip}
                    sx={{
                      textTransform: "none",
                      borderRadius: 3,
                      px: { xs: 2, sm: 3 },
                      fontWeight: 600,
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {isMobile ? "Skip" : "Next Person"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<PersonOffIcon />}
                    onClick={handleDisconnect}
                    sx={{
                      textTransform: "none",
                      borderRadius: 3,
                      px: { xs: 2, sm: 3 },
                      fontWeight: 600,
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        bgcolor: "error.dark",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {isMobile ? "End" : "Disconnect"}
                  </Button>
                </>
              )}
              {status !== "connected" && (
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  startIcon={
                    status === "matching" || status === "matched" ? (
                      <CircularProgress size={16} sx={{ color: "white" }} />
                    ) : (
                      <PersonAddAltIcon />
                    )
                  }
                  onClick={handleConnect}
                  // disabled={status === "connecting"}
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    px: { xs: 2, sm: 3 },
                    fontWeight: 600,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {status === "matching" || status === "matched" ? "Stop" : "Start Connection"}
                </Button>
              )}
            </Paper>
          </Box>

          {/* Chat/Info Area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: isMobile ? "100%" : "300px",
              height: isMobile ? "400px" : "calc(100vh - 100px)",
              overflow: "hidden",
            }}
          >
            {/* Peer Info Card */}
            {status === "connected" && partnerInfo && (
              <Fade in={true} timeout={800}>
                <Accordion
                  defaultExpanded
                  sx={{
                    "&.MuiAccordion-root": {
                      backgroundColor: "background.paper",
                      borderRadius: "16px !important",
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "primary.main",
                      boxShadow: "0 4px 16px rgba(233, 30, 99, 0.2)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                    sx={{
                      bgcolor: "rgba(233, 30, 99, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 600,
                      }}
                    >
                      <FavoriteIcon color="primary" />
                      Your Connection
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Username:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                          {partnerInfo?.username}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          From:
                        </Typography>
                        <Typography variant="body1">
                          {partnerInfo?.country || "Unknown"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Shared Interests:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {partnerInfo?.interests?.length > 0 ? (
                        partnerInfo.interests.map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            size="small"
                            sx={{
                              bgcolor: "primary.main",
                              color: "white",
                              fontWeight: 500,
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No interests shared
                        </Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Fade>
            )}

            {/* Chat Box */}
            <Paper
              elevation={4}
              sx={{
                flex: 1,
                borderRadius: 3,
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                minHeight: isMobile ? "300px" : 0,
                maxHeight: isMobile ? "500px" : "100%",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: `2px solid`,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "rgba(233, 30, 99, 0.05)",
                }}
              >
                <ChatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Chat
                </Typography>
                <Chip
                  label={status.includes("error") ? "Error" : status}
                  size="small"
                  color={status === "connected" ? "success" : "default"}
                  sx={{ ml: "auto", fontWeight: 500 }}
                />
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
                  bgcolor: "background.default",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: "background.default",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "primary.main",
                    borderRadius: "4px",
                  },
                }}
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <Fade in={true} key={index} timeout={300}>
                      <Box
                        sx={{
                          alignSelf:
                            msg.sender === "You" ? "flex-end" : "flex-start",
                          maxWidth: "80%",
                        }}
                      >
                        <Paper
                          elevation={2}
                          sx={{
                            p: 1.5,
                            bgcolor:
                              msg.sender === "You"
                                ? "primary.main"
                                : "background.paper",
                            color:
                              msg.sender === "You"
                                ? "white"
                                : "text.primary",
                            borderRadius: 2,
                            borderTopLeftRadius: msg.sender === "You" ? 2 : 0,
                            borderTopRightRadius: msg.sender === "You" ? 0 : 2,
                            wordBreak: "break-word",
                          }}
                        >
                          <Typography variant="body1">{msg.text}</Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              textAlign: msg.sender === "You" ? "right" : "left",
                              mt: 0.5,
                              opacity: 0.7,
                            }}
                          >
                            {msg?.timestamp?.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Paper>
                      </Box>
                    </Fade>
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
                    <Box>
                      <ChatIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        {status === "connected"
                          ? "Say hello to start the conversation! 👋"
                          : "Messages will appear here once connected"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Message Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `2px solid`,
                  borderColor: "divider",
                  display: "flex",
                  gap: 1,
                  bgcolor: "background.paper",
                }}
              >
                <TextField
                  disabled={status !== "connected"}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder={
                    status === "connected"
                      ? "Type a message..."
                      : "Connect to start chatting"
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || status !== "connected"}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                    transition: "all 0.2s",
                  }}
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "rgba(233, 30, 99, 0.1)",
            borderBottom: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <FavoriteIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            My Interests
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Add interests to match with like-minded people ❤️
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="E.g., Music, Movies, Gaming..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newInterest.trim()) {
                  dispatch(addInterest(newInterest.trim()));
                  setNewInterest("");
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (newInterest.trim()) {
                  dispatch(addInterest(newInterest.trim()));
                  setNewInterest("");
                }
              }}
              disabled={!newInterest.trim()}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Add
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Your Current Interests:
          </Typography>

          {userData?.interests && userData.interests.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {userData.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  onDelete={() => dispatch(removeInterest(interest))}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    fontWeight: 500,
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                      "&:hover": {
                        color: "error.light",
                      },
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                mt: 2,
              }}
            >
              <InterestsIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No interests added yet. Add some to find better matches!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenInterestsDialog(false)}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ConnectionPage;
