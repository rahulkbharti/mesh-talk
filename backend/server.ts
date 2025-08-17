import express, { Application } from "express";
import http, { Server } from "http";
import { Server as socketIo, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";

const PORT: string | number = process.env.PORT || 3000;
const app: Application = express();
const server: Server = http.createServer(app);
const io: socketIo = new socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

type UserData = {
  id: string;
  username: string;
  interests?: string[];
  chatType?: string;
  commonInterests?: string[];
  interestScore?: number;
};

// Use a Set for faster lookups and deduplication
const onlineUsers: Map<string, UserData> = new Map<string, UserData>(); // Using Map for O(1) access by socket ID
const mutex: Mutex = new Mutex();
let connectionCounter: number = 0;

type SocketEventHandler = (socket: Socket, args: any[]) => void;
type SocketEventHandlers = Record<string, SocketEventHandler>;

// Dummy user registration handler for demonstration
async function handleUserRegistration(socket: Socket, args: any[]) {
  const userData: UserData = args[0];
  if (!userData.interests?.length) {
    userData.interests = ["Nothing Common"];
  }
  userData.id = socket.id;

  onlineUsers.set(socket.id, userData);
  await matchAndConnect(socket, userData);
}

async function matchAndConnect(
  socket: Socket,
  currentUser: UserData
): Promise<void> {
  const release = await mutex.acquire();
  const connectionId = ++connectionCounter;

  try {
    console.log("-------------------------------------------");
    console.log(
      `Connection ${connectionId}: Processing ${currentUser.username}`
    );
    console.log("Chat Type:", currentUser.chatType);

    let bestMatch: UserData | null = null;
    let maxScore = -1;
    let commonInterests: string[] = [];

    // Efficient matching with early exit possibilities
    for (const [id, user] of onlineUsers.entries()) {
      if (id === currentUser.id || user.chatType !== currentUser.chatType)
        continue;

      const sharedInterests = calculateInterestScore(currentUser, user);
      if (sharedInterests.length > maxScore) {
        maxScore = sharedInterests.length;
        bestMatch = user;
        commonInterests = sharedInterests;

        // Early exit if perfect match found
        if (currentUser.interests && maxScore === currentUser.interests.length)
          break;
      }
    }

    if (bestMatch && maxScore > 0) {
      // Remove matched users
      onlineUsers.delete(currentUser.id);
      onlineUsers.delete(bestMatch.id);

      const roomId = uuidv4();
      bestMatch.commonInterests = commonInterests;
      bestMatch.interestScore = maxScore;

      io.to(currentUser.id).emit("match", {
        roomId,
        user: bestMatch,
        type: "createAnOffer",
      });
      io.to(bestMatch.id).emit("match", {
        roomId,
        user: currentUser,
        type: "listenForOffer",
      });

      console.log(`Matched ${currentUser.username} with ${bestMatch.username}`);
    } else {
      io.to(currentUser.id).emit(
        "noMatch",
        `No suitable matches found for interests: [${currentUser.interests}]`
      );
    }
  } catch (error) {
    console.error("Matching error:", error);
    io.to(currentUser.id).emit(
      "onError",
      "Error during matching. Please try again."
    );
  } finally {
    release();
  }
}

function calculateInterestScore(user1: UserData, user2: UserData): string[] {
  // Optimized interest calculation using Set intersection
  const set1 = new Set(user1.interests);
  return (user2.interests ?? []).filter((interest: string) =>
    set1.has(interest)
  );
}

// Event handler mapping to avoid code duplication
const socketEventHandlers: SocketEventHandlers = {
  register: handleUserRegistration,
  match: handleUserRegistration,
  offer: (socket, args) => {
    const [offer, toSocketId] = args;
    socket.to(toSocketId).emit("offer", offer);
  },
  iceCandidate: (socket, args) => {
    const [candidate, toSocketId] = args;
    socket.to(toSocketId).emit("iceCandidate", candidate);
  },
  answer: (socket, args) => {
    const [answer, toSocketId] = args;
    socket.to(toSocketId).emit("answer", answer);
  },
  hangUp: (socket, args) => {
    const [toSocketId] = args;
    socket.to(toSocketId).emit("hangUp");
  },
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Set up all event listeners
  for (const [event, handler] of Object.entries(socketEventHandlers)) {
    socket.on(event, (...args) => handler(socket, args));
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    onlineUsers.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
