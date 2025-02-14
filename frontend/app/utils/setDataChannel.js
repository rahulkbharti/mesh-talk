const setupDataChannel = (channel) => {
    channel.onopen = () => {
        console.log("DataChannel is open");
    };

    channel.onmessage = (event) => {

    };

    channel.onclose = () => {
        console.log("DataChannel closed");
    };
};