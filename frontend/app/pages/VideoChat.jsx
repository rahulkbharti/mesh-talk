import React from 'react';
import useWebRTC from '../hooks/useWebRTC';

const userData = { username: "John", interests: ["tech", "gaming"], chatType: "video" };

const VideoChat = () => {
    const { localVideoRef, remoteVideoRef, startCall, endCall } = useWebRTC("http://localhost:3000", userData);

    return (
        <div>
            <h2>WebRTC Video Chat</h2>
            <video ref={localVideoRef} autoPlay playsInline controls style={{ width: '300px' }} />
            <video ref={remoteVideoRef} autoPlay playsInline controls style={{ width: '300px' }} />
            <button onClick={startCall}>Start Call</button>
            <button onClick={endCall}>End Call</button>
        </div>
    );
};

export default VideoChat;
