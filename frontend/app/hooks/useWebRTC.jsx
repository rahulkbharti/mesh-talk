import { memo, use, useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useMedia from './useMediaDevice';

// import useDataChannel from './useDataChannel';

const setUpChannel = (channel) => {
    if (!channel) return;
    channel.onmessage = (event) => {
        console.log("Message Received:", event.data);
    };
    channel.onopen = () => {
        console.log("Channel Opened");
        channel.send("Hello from the client!");
    };
    channel.onclose = () => {
        console.log("Channel Closed");
    };
    channel.onerror = (error) => {
        console.log("Channel Error:", error);
    };
}

const useWebRTC = (serverUrl = "http://localhost:3000", userData) => {
    console.log("WERTC Rendered!");
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const otherUserId = useRef(null); // Store matched user ID

    const [socket, setSocket] = useState(null);
    const [connection, setConnection] = useState(null);
    const localStream = useMedia();
    const [status, setStatus] = useState("idle");

    // 🟢 First useEffect: Initialize and manage socket connection
    useEffect(() => {

        const socket = io(serverUrl, { autoConnect: false }); // Manual connection

        setSocket(socket);

        socket.connect(); // Connect manually
        socket.on("connect", () => console.log("Socket Connected:", socket.id));

        return () => {
            console.log("Socket Cleanup...");
            socket.disconnect(); // Disconnect on unmount
        };
    }, [serverUrl]); // Runs only when `serverUrl` changes

    // 🟢 Second useEffect: Handle socket events and media stream updates
    useEffect(() => {
        if (!socket) return;

        const handleMatch = ({ roomId, user, type }) => {
            otherUserId.current = user.id;
            console.info(`Matched with ${user.username}. Room ID: ${roomId}`);
            if (type === "createAnOffer") {
                initateCall(localStream, "offer");
                console.log('I have to create an offer');

            } else {
                initateCall(localStream, "answer");
                console.log('I have to create an answer');
            }
        };
        socket.on('match', handleMatch);

        if (localStream) {
            // console.log("Searching For partner:", userData);
            // socket.emit("match", userData);
            localVideoRef.current.srcObject = localStream;
        }

        return () => {
            socket.off("match", handleMatch);
        };
    }, [socket, localStream]); // Runs when socket or localStream changes


    useEffect(() => {
        if (!socket && !connection) return;

        const handleOffer = async (offer) => {

            await connection.setRemoteDescription(offer);
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            socket.emit("answer", answer, otherUserId.current);
        }
        const handleAnswer = async (answer) => {
            // console.log("Received Answer:", answer);
            await connection.setRemoteDescription(answer);
        }
        const handleIceCandidate = async (candidate) => {
            // console.log("Received ICE Candidate:", candidate);
            await connection.addIceCandidate(candidate);
        }
        const handleHangUp = () => {
            console.log("Received HangUp");
            endCall(false);
        }
        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("iceCandidate", handleIceCandidate);
        socket.on("hangUp", handleHangUp);

        return () => {
            socket.off("offer", handleOffer);
            socket.off("answer", handleAnswer);
            socket.off("iceCandidate", handleIceCandidate);
            socket.off("hangUp", handleHangUp);

            console.log("Connection Cleanup...");
            // setConnection(null);
        }
    }, [connection]); // Runs when connection changes

    const initateCall = (localStream, type = "offer") => {
        console.log("Starting Call...");
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
            localStream.getTracks().forEach(track => connection.addTrack(track, localStream));
        }


        connection.onicecandidate = (event) => {
            if (event.candidate) {
                // console.log("Sending ICE Candidate to Peer:", event.candidate);
                socket.emit("iceCandidate", event.candidate, otherUserId.current);
            }
        };
        connection.ondatachannel = (event) => {
            console.log("Data Channel Received:", event.channel);
            setUpChannel(event.channel);
        };
        connection.ontrack = (event) => {
            // console.log("Received Remote Stream:", event.streams[0]);
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        connection.onnegotiationneeded = async () => {
            console.log("Negotiation Needed...");
            // const offer = await connection.createOffer();
            // await connection.setLocalDescription(offer);
            // socket.emit("offer", offer, otherUserId.current);
        };
        // Create Offer or Answer based on type
        if (type === "offer") {
            const channel = connection.createDataChannel("chat");

            console.log("Data Channel Created:", channel);
            setUpChannel(channel);
            connection.createOffer().then(offer => {
                connection.setLocalDescription(offer);
                socket.emit("offer", offer, otherUserId.current);
            });
        }
    }

    const startCall = () => {
        if (!localStream || !socket) {
            console.error("Local stream not available at startCall()");
            return;
        }
        console.log("Searching For partner:", userData);
        socket.emit("match", userData);
        localVideoRef.current.srcObject = localStream;
    }

    const endCall = (inform = true) => {
        console.log("Ending Call...");
        if (socket && inform) {
            socket.emit("hangUp", otherUserId.current);
        }
        if (connection) {
            connection.close();
        }
        remoteVideoRef.current.srcObject = null;
    }

    return { localVideoRef, remoteVideoRef, startCall, endCall };
};

export default useWebRTC;
