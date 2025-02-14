
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

export default setUpChannel;