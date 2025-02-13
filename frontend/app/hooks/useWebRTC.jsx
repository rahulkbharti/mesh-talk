import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useMedia from './useMediaDevice';


const useWebRTC = (serverUrl = "http://localhost:3000", userData) => {
    const [socket, setSocket] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const peerConnection = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const otherUserId = useRef(null); // Store matched user ID

    // Use the custom media hook
    const localStream = useMedia();
    if (localStream) {
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    };
    useEffect(() => {
        const newSocket = io(serverUrl);
        setSocket(newSocket);

        newSocket.emit('match', userData); // Send user data to match

        newSocket.on('match', ({ roomId, user, type }) => {
            otherUserId.current = user.id;
            console.log(`Matched with ${user.username}. Room ID: ${roomId}`);

            if (type === "createAnOffer") {
                startCall(); // Initiate WebRTC offer
            }
        });

        newSocket.on('offer', async (offer) => {
            console.log("Received offer from", otherUserId.current);
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            newSocket.emit('answer', answer, otherUserId.current);
        });

        newSocket.on('answer', async (answer) => {
            console.log("Received answer from", otherUserId.current);
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        newSocket.on('iceCandidate', async (candidate) => {
            console.log("Received ICE Candidate");
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        newSocket.on('hangUp', () => {
            console.log("Call ended by the other user.");
            endCall();
        });

        return () => {
            newSocket.removeAllListeners();
            newSocket.disconnect();
        };
    }, [serverUrl, userData]);

    const startCall = async () => {
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

        if (localStream) {
            // if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

            localStream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, localStream);
            });

            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socket.emit('offer', offer, otherUserId.current);
        } else {
            console.error("Local stream not available");
        }
    };

    const endCall = () => {
        console.log("Ending Call...");
        peerConnection.current?.close();
        setRemoteStream(null);
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        socket.emit("hangUp", otherUserId.current);
    };

    return { localVideoRef, remoteVideoRef, startCall, endCall };
};

export default useWebRTC;
