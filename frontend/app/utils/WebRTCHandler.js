import { io } from "socket.io-client";
class WebRTC {
    constructor(socket = "http://localhost:3000") {
        this.pc = null;
        this.socket = io(socket);
        this.localStream = null;
        this.remoteStream = null;
        this.constraints = { video: true, audio: true };
    }
}
export default WebRTC;
