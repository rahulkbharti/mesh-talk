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
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Use a Set for faster lookups and deduplication
const onlineUsers = new Map(); // Using Map for O(1) access by socket ID
const mutex = new Mutex();
let connectionCounter = 0;

// Event handler mapping to avoid code duplication
const socketEventHandlers = {
    'register': handleUserRegistration,
    'match': handleUserRegistration,
    'offer': (socket, [offer, toSocketId]) => {
        socket.to(toSocketId).emit("offer", offer);
    },
    'iceCandidate': (socket, [candidate, toSocketId]) => {
        socket.to(toSocketId).emit("iceCandidate", candidate);
    },
    'answer': (socket, [answer, toSocketId]) => {
        socket.to(toSocketId).emit("answer", answer);
    },
    'hangUp': (socket, [toSocketId]) => {
        socket.to(toSocketId).emit("hangUp");
    }
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Set up all event listeners
    for (const [event, handler] of Object.entries(socketEventHandlers)) {
        socket.on(event, (...args) => handler(socket, args));
    }

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        onlineUsers.delete(socket.id);
    });
});

async function handleUserRegistration(socket, [userData]) {
    if (!userData.interests?.length) {
        userData.interests = ["Nothing Common"];
    }
    userData.id = socket.id;

    onlineUsers.set(socket.id, userData);
    await matchAndConnect(socket, userData);
}

async function matchAndConnect(socket, currentUser) {
    const release = await mutex.acquire();
    const connectionId = ++connectionCounter;

    try {
        console.log("-------------------------------------------");
        console.log(`Connection ${connectionId}: Processing ${currentUser.username}`);
        console.log("Chat Type:", currentUser.chatType);

        let bestMatch = null;
        let maxScore = -1;
        let commonInterests = [];

        // Efficient matching with early exit possibilities
        for (const [id, user] of onlineUsers.entries()) {
            if (id === currentUser.id || user.chatType !== currentUser.chatType) continue;

            const sharedInterests = calculateInterestScore(currentUser, user);
            if (sharedInterests.length > maxScore) {
                maxScore = sharedInterests.length;
                bestMatch = user;
                commonInterests = sharedInterests;

                // Early exit if perfect match found
                if (maxScore === currentUser.interests.length) break;
            }
        }

        if (bestMatch && maxScore > 0) {
            // Remove matched users
            onlineUsers.delete(currentUser.id);
            onlineUsers.delete(bestMatch.id);

            const roomId = uuidv4();
            bestMatch.commonInterests = commonInterests;
            bestMatch.interestScore = maxScore;

            io.to(currentUser.id).emit('match', {
                roomId,
                user: bestMatch,
                type: "createAnOffer"
            });
            io.to(bestMatch.id).emit('match', {
                roomId,
                user: currentUser,
                type: "listenForOffer"
            });

            console.log(`Matched ${currentUser.username} with ${bestMatch.username}`);
        } else {
            io.to(currentUser.id).emit('noMatch',
                `No suitable matches found for interests: [${currentUser.interests}]`
            );
        }
    } catch (error) {
        console.error('Matching error:', error);
        io.to(currentUser.id).emit('onError', 'Error during matching. Please try again.');
    } finally {
        release();
        console.log("-------------------------------------------");
    }
}

function calculateInterestScore(user1, user2) {
    // Optimized interest calculation using Set intersection
    const set1 = new Set(user1.interests);
    return user2.interests.filter(interest => set1.has(interest));
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});