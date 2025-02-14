import { useEffect, useRef } from "react";
import useMedia from "../hooks/useMediaDevice"

const Media = () => {
    const media = useMedia();
    const localStream = useRef(null);
    useEffect(() => {
        if (media) {
            localStream.current.srcObject = media;
            console.log("Media Stream:", media);
        }
    }, [media]);
    return (
        <div>
            <h1>Media</h1>
            <video ref={localStream} autoPlay playsInline muted style={{ width: '300px', transform: "scaleX(-1)" }} />

        </div>
    )
}
export default Media;