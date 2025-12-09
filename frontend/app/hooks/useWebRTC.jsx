import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useMedia from "./useMediaDevice";

const useWebRTC = (serverUrl = "http://localhost:3000", userData) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerData = useRef({
    username: null,
    interests: [],
    chatType: null,
    name: null,
    age: null,
    location: null,
    bio: null,
    avatar: null,
  }); // Store matched user data

  const [socket, setSocket] = useState(null);
  const [connection, setConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);

  const localStream = useMedia();
  const [status, setStatus] = useState("idle"); // 'idle', 'connecting', 'matched', 'connected', 'socket-disconnected', 'peer-disconnected', 'socket-error', 'peer-error'
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [message, setMessage] = useState([]);

  const [isVideo, setIsVideo] = useState(true);
  const [isAudio, setIsAudio] = useState(true);

  const updateStatus = (newStatus) => {
    if (status === "idle" && newStatus.includes("disconnected")) return;
    console.log(`Status changed from ${status} to ${newStatus}`);
    setStatus(newStatus);
  };

  const setUpChannel = (channel) => {
    if (!channel) return;
    channel.onmessage = (event) => {
      console.log("Message Received:", event.data);
      const audio = new Audio("/mesh-talk/23.mp3");
      audio.play().catch((err) => console.error("Audio play failed:", err));
      setMessage((prev) => [
        ...prev,
        {
          sender: "Peer",
          text: event.data,
          timestamp: new Date(),
          isLocal: false,
        },
      ]);
    };
    channel.onopen = () => {
      console.log("Channel Opened");
      channel.send("Your Connected!");
      setDataChannel(channel);
      if (window.navigator.vibrate) {
        window.navigator.vibrate([50, 50, 150]);
        console.log("Connection success haptic feedback sent.");
      } else {
        console.warn("Vibration API not supported on this device.");
      }
      updateStatus("connected");
    };
    channel.onclose = () => {
      setDataChannel(null);
      updateStatus("peer-disconnected");
      console.log("Channel Closed");
    };
    channel.onerror = (error) => {
      setDataChannel(null);
      updateStatus("peer-error");
      console.log("Channel Error:", error);
    };
  };

  // First useEffect: Initialize and manage socket connection
  useEffect(() => {
    const socket = io(serverUrl, { autoConnect: false }); // Manual connection
    updateStatus("connecting");

    setSocket(socket);

    socket.connect(); // Connect manually
    socket.on("connect", () => {

      console.log("Socket Connected:", socket.id);
      updateStatus("idle");
    });
    socket.on("onlineUsers", (count) => {
      setOnlineUsers(count?.totalConnected ?? 0);
    });
    socket.on("disconnect", () => {
      updateStatus("socket-disconnected");
    });

    socket.on("connect_error", () => {
      updateStatus("socket-error");
    });

    return () => {
      console.log("Socket Cleanup...");
      socket.disconnect(); // Disconnect on unmount
      peerData.current = null;
      updateStatus("socket-disconnected");
    };
  }, [serverUrl]); // Runs only when `serverUrl` changes

  // Second useEffect: Handle socket events and media stream updates
  useEffect(() => {
    if (!socket) return;

    const handleMatch = ({ roomId, user, type }) => {
      peerData.current = user;
      updateStatus("matched");
      console.info(`Matched with ${user.username}. Room ID: ${roomId}`);
      if (type === "createAnOffer") {
        initateCall(localStream, "offer");
        console.log("I have to create an offer");
      } else {
        initateCall(localStream, "answer");
        console.log("I have to create an answer");
      }
    };
    socket.on("match", handleMatch);

    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    return () => {
      socket.off("match", handleMatch);
    };
  }, [socket, localStream]); // Runs when socket or localStream changes

  useEffect(() => {
    if (!socket && !connection) return;

    const handleOffer = async (offer) => {
      updateStatus("connecting");
      await connection.setRemoteDescription(offer);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      socket.emit("answer", answer, peerData.current?.id);
    };
    const handleAnswer = async (answer) => {
      await connection.setRemoteDescription(answer);
    };
    const handleIceCandidate = async (candidate) => {
      await connection.addIceCandidate(candidate);
    };
    const handleHangUp = () => {
      console.log("Received HangUp");
      endCall(false);
      updateStatus("peer-disconnected");
    };
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("hangUp", handleHangUp);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("hangUp", handleHangUp);
    };
  }, [connection]); // Runs when connection changes

  const initateCall = (localStream, type = "offer") => {
    console.log("Starting Call...");
    updateStatus("connecting");
    const configuration = {
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
    };
    const connection = new RTCPeerConnection(configuration);
    setConnection(connection);
    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => connection.addTrack(track, localStream));
    }

    connection.oniceconnectionstatechange = () => {
      console.log(
        "ICE Connection State Changed:",
        connection.iceConnectionState
      );
      // Map WebRTC ICE states to our status system
      switch (connection.iceConnectionState) {
        case "checking":
          updateStatus("connecting");
          break;
        case "connected":
        case "completed":
          updateStatus("connected");
          break;
        case "disconnected":
          updateStatus("peer-disconnected");
          break;
        case "failed":
          updateStatus("peer-error");
          break;
        case "closed":
          updateStatus("peer-disconnected");
          break;
        default:
          break;
      }
    };

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", event.candidate, peerData.current?.id);
      }
    };
    connection.ondatachannel = (event) => {
      console.log("Data Channel Received:", event.channel);
      setUpChannel(event.channel);
    };
    connection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    connection.onnegotiationneeded = async () => {
      console.log("Negotiation Needed...");
    };

    if (type === "offer") {
      const channel = connection.createDataChannel("chat");
      console.log("Data Channel Created:", channel);
      setUpChannel(channel);
      connection.createOffer().then((offer) => {
        connection.setLocalDescription(offer);
        socket.emit("offer", offer, peerData.current?.id);
      });
    }
  };

  const sendMessage = useCallback(
    (message) => {
      if (dataChannel) {
        dataChannel.send(message);
        setMessage((prev) => [
          ...prev,
          {
            sender: "You",
            text: message,
            timestamp: new Date(),
            isLocal: true,
          },
        ]);
      }
    },
    [dataChannel]
  );

  const startCall = () => {
    if (!localStream || !socket) {
      console.error("Local stream not available at startCall()");
      updateStatus("peer-error");
      return;
    }
    console.log("Searching For partner:", userData);
    updateStatus("matching");
    socket.emit("match", userData);
    localVideoRef.current.srcObject = localStream;
  };

  const endCall = (inform = true) => {
    console.log("Ending Call...");
    if (socket && inform) {
      socket.emit("hangUp", peerData.current?.id);
    }
    if (connection) {
      connection.close();
    }
    setMessage([]);
    remoteVideoRef.current.srcObject = null;
    updateStatus("idle");
  };

  const toggleVideo = () => {
    const newVideoState = !isVideo;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = newVideoState;
    });
    setIsVideo(newVideoState);
  };

  const toggleAudio = () => {
    const newAudioState = !isAudio;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = newAudioState;
    });
    setIsAudio(newAudioState);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    messages: message,
    sendMessage,
    status, // Expose status to the component
    partnerInfo: peerData.current, // Expose matched user data
    toggleVideo,
    toggleAudio,
    isAudio,
    isVideo,
    onlineUsers
  };
};

export default useWebRTC;
