import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useMedia from './useMediaDevice';
import useDataChannel from './useDataChannel';


const Test = (serverUrl = "http://localhost:3000", userData) => {
    const [socket, setSocket] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const peerConnection = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const otherUserId = useRef(null); // Store matched user ID

    const isInitiator = useRef(false);
    // const { createDataChannel, sendMessage, messages, isConnected } = useDataChannel(peerConnection.current, isInitiator.current);

    // Use the custom m edia hook
    const localStream = useMedia();
    const stream = useRef(localStream);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    });

    const test = useCallback(() => {
        console.log("TEST ;", stream.current);
    });
    useEffect(() => {
        const socket = io(serverUrl);
        setSocket(socket);
        socket.on("connect", () => {
            console.log("Connected to server!");
            console.log("Socket ID:", socket.id); // Unique socket ID

            // Test
            // test();



            socket.on('match', ({ roomId, user, type }) => {
                otherUserId.current = user.id;
                console.info(`Matched with ${user.username}. Room ID: ${roomId}`);

                if (type === "createAnOffer") {
                    test(); // Initiate WebRTC offer
                    isInitiator.current = true;
                } else {
                    isInitiator.current = false;
                }
            });
            socket.on('offer', async (offer) => {
                if (!peerConnection.current) return;
                console.log("Received offer from", otherUserId.current);

                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit('answer', answer, otherUserId.current);
            });

            socket.on('answer', async (answer) => {
                if (!peerConnection.current) return;
                console.log("Received answer from", otherUserId.current);
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on('iceCandidate', async (candidate) => {
                if (!peerConnection.current) return;
                console.log("Received ICE Candidate");
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            });

            socket.on('hangUp', () => {
                console.log("Call ended by the other user.");
                endCall(false);
            });
            socket.emit('match', userData); // Send user data to match
        });
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [serverUrl, userData]);

    const startCall = useCallback(async () => {

        if (!localStream) {
            console.error("Local stream not available at startCall()");
            return;
        }

        console.log("Starting Call...");
        peerConnection.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('iceCandidate', event.candidate, otherUserId.current);
            }
        };

        peerConnection.current.ontrack = (event) => {
            console.log("Receiving Remote Stream...");
            setRemoteStream(event.streams[0]);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        // createDataChannel();

        localStream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream);
        });

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('offer', offer, otherUserId.current);

    }, [localStream]);


    const endCall = (inform = false) => {
        console.log("Ending Call...");
        peerConnection.current?.close();
        setRemoteStream(null);
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        peerConnection.current = null;
        if (!inform) return;
        socket.emit("hangUp", otherUserId.current);
    };

    return { localVideoRef, remoteVideoRef, startCall, endCall };
};

export default Test;
