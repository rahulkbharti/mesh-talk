import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";  // Change if needed
const TOTAL_USERS = 100;  // Adjust the number of fake users

let users = [];

console.log(`Starting test with ${TOTAL_USERS} fake users...`);

for (let i = 0; i < TOTAL_USERS; i++) {
    const socket = io(SERVER_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
        console.log(`User ${i + 1} connected with ID: ${socket.id}`);
    });

    socket.on("updateUserCount", (data) => {
        console.log(`Current Users Online: ${data.totalUsers}`);
    });

    socket.on("disconnect", () => {
        console.log(`User ${i + 1} disconnected`);
    });

    users.push(socket);
}

// Optional: Disconnect users after some time
setTimeout(() => {
    console.log("Disconnecting all fake users...");
    users.forEach(socket => socket.disconnect());
}, 30000);  // Disconnect after 30 seconds
