import React, { use, useEffect, useRef, useState } from 'react';
import useWebRTC from '../hooks/useWebRTC';
import { useSelector } from 'react-redux';

const userData = { username: "John", interests: ["tech", "gaming"], chatType: "video" };

const VideoChat = () => {
    const [value, setValue] = useState(0);
    const interests = useSelector((state) => state.intrest.intrest);
    userData.interests = interests;
    const { localVideoRef, remoteVideoRef, startCall, endCall, sendMessage, message } = useWebRTC("https://real-time-video-chat-backend.onrender.com", userData);
    const ChatBox = useRef(null);
    // const [message, setMessage] = useState("");

    // useEffect(() => {
    //     console.log("Message:", message);
    // }, [message]);

    console.log(message);

    return (
        <div>

            <h2>WebRTC Video Chat</h2>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', transform: "scaleX(-1)" }} />
            <video ref={remoteVideoRef} autoPlay playsInline controls style={{ width: '300px' }} />
            <button onClick={startCall}>Start Call</button>
            <button onClick={endCall}>End Call</button>
            <br />
            <div>
                <h3>Chat</h3>
                <div ref={ChatBox} style={{ border: '1px solid black', height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
                    {message && message.map((msg, index) => (
                        <div key={index}>{msg?.role} : {msg?.message}</div>
                    ))}
                </div>
                <input type="text" id="chatInput" placeholder="Type a message..." onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage(e.target.value);
                        e.target.value = '';
                    }
                }} />
            </div>
            <span>{value}</span>
            <button onClick={() => setValue((pre) => pre + 1)}>Counter</button>
        </div>
    );
};

export default VideoChat;
