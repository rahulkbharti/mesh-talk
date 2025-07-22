import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputBase,
  Badge,
  Fab,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  Message,
  ScreenShare,
  Favorite,
  MoreVert,
  Send,
  FlashOn,
  Mood,
  AttachFile,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useWebRTC from "../hooks/useWebRTC";
import { useSelector } from "react-redux";

const RoomPage = () => {
  // Media states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState("");

  // Dating-specific states
  const [isFavorite, setIsFavorite] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [connectionStrength, setConnectionStrength] = useState(3); // 1-4

  const userData = {
    username: "John",
    chatType: "video",
    name: "Alex Johnson",
    age: 28,
    location: "15 miles away",
    bio: "Love exploring new places and meeting interesting people. Let's connect!",
    avatar: "AJ",
  };
  const SOCKET_SERVER = import.meta.env.VITE_BACKEND;
  const interests = useSelector((state) => state.intrest.intrest);
  userData.interests = interests;

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

  console.log("Partner Info:", partnerInfo);
  // Mock data for dating context
  const partnerProfile = {
    name: "Alex Johnson",
    age: 28,
    location: "15 miles away",
    interests: ["Hiking", "Photography", "Jazz"],
    bio: "Love exploring new places and meeting interesting people. Let's connect!",
    avatar: "AJ",
  };

  // Mock P2P connection setup
  useEffect(() => {
    // Simulate connection process
    const timer = setTimeout(() => {
      setConnectionStatus("Connected");

      console.log(localVideoRef);
      // // In a real app, you would set up the actual video streams here
      // // This is just for UI demonstration
      // if (localVideoRef.current) {
      //   // localVideoRef.current.srcObject = localStream;
      // }
      // if (remoteVideoRef.current) {
      //   // remoteVideoRef.current.srcObject = remoteStream;
      // }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Dating-specific functions
  const handleSendLike = () => {
    setIsFavorite(!isFavorite);
    // In a real app, send this to the partner
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, send the message via your P2P data channel
      setMessage("");
      sendMessage(message.trim());
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
        p: 2,
      }}
    >
      {/* Header with partner info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: isFavorite ? "error.main" : "primary.main",
            }}
          >
            {partnerInfo?.avatar || "?"}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {partnerInfo.name}, {partnerInfo.age}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {partnerInfo.location}
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton
            onClick={handleSendLike}
            color={isFavorite ? "error" : "default"}
          >
            <Favorite />
          </IconButton>
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Connection status bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          px: 2,
          py: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: status === "Connected" ? "success.main" : "warning.main",
            mr: 1,
          }}
        />
        <Typography variant="caption" sx={{ flexGrow: 1 }}>
          {status}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {[...Array(4)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: (i + 1) * 4,
                bgcolor: i < connectionStrength ? "success.main" : "divider",
                ml: 0.5,
                borderRadius: 1,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Video Area */}
        <Grid item xs={12} md={isChatOpen ? 8 : 12}>
          <Paper
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              bgcolor: "black",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Remote Video */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                bgcolor: "background.paper",
              }}
              component={"video"}
              ref={remoteVideoRef}
              width={"100%"}
              autoPlay
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: "primary.main",
                }}
              >
                {partnerInfo.avatar}
              </Avatar>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {partnerInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {connectionStatus}
              </Typography>
            </Box>

            {/* Local Video */}

            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                width: "30%",
                aspectRatio: "16/9",
                bgcolor: "black",
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: 3,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Box
                component={"video"}
                sx={{
                  aspectRatio: "16/9",
                  width: "100%",
                  display: isVideoOn ? "block" : "none",
                }}
                ref={localVideoRef}
                autoPlay
              ></Box>

              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.800",
                }}
              >
                <Avatar sx={{ width: 64, height: 64 }}>Y</Avatar>
              </Box>
            </Box>

            {/* Dating Icebreaker Button */}
            <Fab
              color="secondary"
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
              }}
            >
              <FlashOn />
            </Fab>
          </Paper>
        </Grid>

        {/* Chat Panel */}
        {isChatOpen && (
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
              }}
            >
              {/* Profile Summary */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">
                    About {partnerInfo.name}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography variant="body2">{partnerInfo.bio}</Typography>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {partnerInfo.interests.map((interest, i) => (
                      <Chip
                        key={i}
                        label={interest}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Messages */}
              <List
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 2,
                  bgcolor: "background.default",
                  maxHeight: "400px",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: "8px",
                  },
                }}
              >
                {messages.map((msg, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      justifyContent: msg.isLocal ? "flex-end" : "flex-start",
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: msg.isLocal ? "row-reverse" : "row",
                        alignItems: "flex-end",
                        gap: 1,
                        maxWidth: "90%",
                      }}
                    >
                      {!msg.isLocal && (
                        <ListItemAvatar sx={{ minWidth: "auto" }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {msg.sender.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                      )}
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          bgcolor: msg.isLocal ? "primary.main" : "grey.700",
                          color: msg.isLocal
                            ? "primary.contrastText"
                            : "text.primary",
                          borderTopRightRadius: msg.isLocal ? 0 : "inherit",
                          borderTopLeftRadius: !msg.isLocal ? 0 : "inherit",
                        }}
                      >
                        <ListItemText
                          primary={msg.text}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: msg.isLocal ? "right" : "left",
                            mt: 0.5,
                            opacity: 0.7,
                            color: msg.isLocal
                              ? "primary.contrastText"
                              : "text.secondary",
                          }}
                        >
                          {msg.isLocal ? "You" : msg.sender} •{" "}
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                ))}
              </List>

              {/* Message Input with Dating Features */}
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    borderRadius: 2,
                    bgcolor: "background.default",
                  }}
                >
                  <IconButton size="small">
                    <Mood />
                  </IconButton>
                  <IconButton size="small">
                    <AttachFile />
                  </IconButton>
                  <InputBase
                    fullWidth
                    placeholder="Type a sweet message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    sx={{
                      flexGrow: 1,
                      mx: 1,
                      py: 1,
                    }}
                  />
                  <IconButton
                    color="primary"
                    disabled={!message.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send />
                  </IconButton>
                </Paper>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Controls with Romantic Accents */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          gap: 1,
        }}
      >
        <IconButton
          sx={{
            bgcolor: isAudioOn ? "primary.light" : "error.main",
            color: isAudioOn ? "primary.contrastText" : "error.contrastText",
            "&:hover": {
              bgcolor: isAudioOn ? "primary.main" : "error.dark",
            },
          }}
          onClick={() => setIsAudioOn(!isAudioOn)}
        >
          {isAudioOn ? <Mic /> : <MicOff />}
        </IconButton>

        <IconButton
          sx={{
            bgcolor: isVideoOn ? "primary.light" : "error.main",
            color: isVideoOn ? "primary.contrastText" : "error.contrastText",
            "&:hover": {
              bgcolor: isVideoOn ? "primary.main" : "error.dark",
            },
          }}
          onClick={() => setIsVideoOn(!isVideoOn)}
        >
          {isVideoOn ? <Videocam /> : <VideocamOff />}
        </IconButton>

        <IconButton
          sx={{
            bgcolor: "error.main",
            color: "error.contrastText",
            "&:hover": {
              bgcolor: "error.dark",
            },
          }}
          onClick={endCall}
        >
          <CallEnd />
        </IconButton>

        <IconButton
          sx={{
            bgcolor: "secondary.light",
            color: "secondary.contrastText",
            "&:hover": {
              bgcolor: "secondary.main",
            },
          }}
          onClick={startCall}
        >
          <ScreenShare />
        </IconButton>

        <IconButton
          sx={{
            bgcolor: isChatOpen ? "primary.main" : "primary.light",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <Badge badgeContent={messages.length} color="error">
            <Message />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
};

export default RoomPage;
