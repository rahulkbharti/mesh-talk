import { io } from "socket.io-client";
class WebRTC {
    constructor(socket = "http://localhost:3000") {
        this.pc = null;
        this.socket = io(socket);
        this.localStream = null;
        this.remoteStream = null;
        this.constraints = { video: true, audio: true };
        this.setSocketListeners();
    }
    // Set Socket Linsteners
    setSocketListeners() {
        this.socket.on("offer", this.handleOffer);
        this.socket.on("answer", this.handleAnswer);
        this.socket.on("iceCandidate", this.handleIceCandidate);
    }
    // Connect 
    static async connect() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.localStream = stream;
            return stream;
        } catch (error) {
            console.error("Error occurred while connecting to the stream", error);
        }
    }
}

export default WebRTC;