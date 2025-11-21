import { useEffect, useState } from "react";

const useMedia = (config = {}) => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let mediaStream;
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setStream(stream);
        mediaStream = stream; // Store the stream for cleanup
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Run once on mount

  return stream;
};

export default useMedia;
