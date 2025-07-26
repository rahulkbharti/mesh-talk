import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Mutex } from 'async-mutex';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
    cors: {
        origin: "*", // Frontend URLs
        methods: ["GET", "POST"]
    }
});

// Array to store users currently online
let onlineUsers = [];
const mutex = new Mutex();

io.on('connection', (socket) => {
    console.log('A user connected: Id=> ', socket.id);
    let otherSide = null;
    socket.on("test", () => {
        socket.emit("test", "Hello");
    })
    // Handle user registration and matching
    socket.on('register', (userData) => {
        const user = {
            id: socket.id,
            username: userData.username,
            interests: userData.interests || [], // assuming interests is an array of strings
            ...userData
        };
        onlineUsers.push(user);

        // Attempt to match with another user
        matchAndConnect(socket, user).then(r => { });
    });

    socket.on("match", (userData) => {
        const user = {
            id: socket.id,
            username: userData?.username,
            interests: userData?.interests || ["Nothing Common"], // assuming interests is an array of strings
            chatType: userData?.chatType,
            ...userData
        };
        onlineUsers.push(user);

        // Attempt to match with another user
        matchAndConnect(socket, user).then(bestMatch => { });
    });

    socket.on("offer", (offer, toSocketId) => {
        console.log("Transferring offer to Answerer to :", toSocketId);
        socket.to(toSocketId).emit("offer", offer);
    });

    socket.on("iceCandidate", (candidate, toSocketId) => {
        console.log("Transferring candidate to :", toSocketId);
        socket.to(toSocketId).emit("iceCandidate", candidate);
    });

    socket.on("answer", (answer, toSocketId) => {
        console.log("Transferring the answer to :", toSocketId);
        socket.to(toSocketId).emit("answer", answer);
    });

    socket.on("hangUp", (toSocketId) => {
        console.log("sending HangUp to:", toSocketId);
        socket.to(toSocketId).emit("hangUp");
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove user from onlineUsers array on disconnect
        onlineUsers = onlineUsers.filter(u => u.id !== socket.id);
    });
});

let connectionNumber = 0;

async function matchAndConnect(socket, currentUser) {
    // Find a matching user with highest interest score
    const release = await mutex.acquire(); // Acquire the mutex
    console.log("-------------------------------------------");
    console.log("Connection Number:", ++connectionNumber);
    console.log("Lock Acquired by user:", currentUser.username);
    console.log("Chat Type:", currentUser.chatType);

    let bestMatch = null;

    try {
        let maxInterestScore = -1;
        onlineUsers.forEach(user => {
            if ((user.id !== currentUser.id) && (user.chatType === currentUser.chatType)) {
                const interestScore = calculateInterestScore(currentUser, user);
                if (interestScore > maxInterestScore) {
                    maxInterestScore = interestScore;
                    bestMatch = user;
                }
            }
        });
        console.log("Best Match:", bestMatch, "Interest Score:", maxInterestScore);
        if (bestMatch && maxInterestScore > 0) {
            // Remove both users from onlineUsers array
            onlineUsers = onlineUsers.filter(u => u.id !== currentUser.id && u.id !== bestMatch.id);

            // Create a unique room ID for the chat session
            const roomId = uuidv4();

            // Notify both users about the room ID and each other's details
            io.to(currentUser.id).emit('match', { roomId, user: bestMatch, type: "createAnOffer" });
            io.to(bestMatch.id).emit('match', { roomId, user: currentUser, type: "listenForOffer" });
            console.log(`Match Found with ${bestMatch.username}, exchanging the Ids.`);
        } else {
            // If no suitable match is found, notify the current user
            io.to(currentUser.id).emit('noMatch', `No suitable users available right now with your intrest:[${currentUser.interests}]. Please try again later or Connect Randomly.`);
        }
    } catch (error) {
        io.to(currentUser.id).emit('onError', 'Something Wrong Happened. Please try again later.');
    } finally {
        console.log("Released the Lock.");
        release();  // Release the mutex
        console.log("-------------------------------------------");
    }

    return bestMatch;
}

function calculateInterestScore(user1, user2) {
    // Simple matching score based on number of shared interests
    const interests1 = new Set(user1.interests);
    const interests2 = new Set(user2.interests);
    const sharedInterests = [...interests1].filter(interest => interests2.has(interest));
    return sharedInterests.length;
}

server.listen(PORT, () => {
    console.log('Server running on port 3000');
});
