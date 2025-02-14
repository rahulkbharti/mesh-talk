import React, { useRef, useState } from 'react';
import useWebRTC from '../hooks/useWebRTC';
import { useSelector } from 'react-redux';

const userData = { username: "John", interests: ["tech", "gaming"], chatType: "video" };

const VideoChat = () => {
    const [value, setValue] = useState(0);
    const interests = useSelector((state) => state.intrest.intrest);
    userData.interests = interests;
    const { localVideoRef, remoteVideoRef, startCall, endCall } = useWebRTC("http://localhost:3000", userData);
    const ChatBox = useRef(null);
    // const [message, setMessage] = useState("");
    const onMessage = (message) => {

    }
    const sendMessage = () => {

    }
    return (
        <div>
            <h2>WebRTC Video Chat</h2>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', transform: "scaleX(-1)" }} />
            <video ref={remoteVideoRef} autoPlay playsInline controls style={{ width: '300px' }} />
            <button onClick={startCall}>Start Call</button>
            <button onClick={endCall}>End Call</button>
            <br />
            <span>{value}</span>
            <button onClick={() => setValue((pre) => pre + 1)}>Counter</button>
        </div>
    );
};

export default VideoChat;
