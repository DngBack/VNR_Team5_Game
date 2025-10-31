const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Game rooms storage
const rooms = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Admin creates a room
    socket.on('create-room', (data) => {
        const roomCode = data.roomCode;
        const adminId = socket.id;
        
        rooms.set(roomCode, {
            code: roomCode,
            adminId: adminId,
            players: new Map(),
            currentQuestion: 0,
            gameStarted: false,
            answers: [],
            stage: 1
        });
        
        socket.join(roomCode);
        socket.emit('room-created', { roomCode });
        console.log(`Room ${roomCode} created by admin ${adminId}`);
    });

    // Player joins a room
    socket.on('join-room', (data) => {
        const { roomCode, playerName } = data;
        const room = rooms.get(roomCode);
        
        if (!room) {
            socket.emit('room-error', { message: 'Room not found' });
            return;
        }
        
        if (room.gameStarted) {
            socket.emit('room-error', { message: 'Game already started' });
            return;
        }
        
        room.players.set(socket.id, {
            id: socket.id,
            name: playerName,
            answers: [],
            currentStage: 1
        });
        
        socket.join(roomCode);
        socket.emit('joined-room', { roomCode, playerName });
        
        // Notify admin about new player
        io.to(room.adminId).emit('player-joined', {
            playerId: socket.id,
            playerName: playerName,
            totalPlayers: room.players.size
        });
        
        console.log(`Player ${playerName} joined room ${roomCode}`);
    });

    // Admin starts the game
    socket.on('start-game', (data) => {
        const { roomCode } = data;
        const room = rooms.get(roomCode);
        
        if (!room || socket.id !== room.adminId) {
            return;
        }
        
        room.gameStarted = true;
        io.to(roomCode).emit('game-started');
        console.log(`Game started in room ${roomCode}`);
    });

    // Admin sends question to players
    socket.on('send-question', (data) => {
        const { roomCode, stage } = data;
        const room = rooms.get(roomCode);
        
        if (!room || socket.id !== room.adminId) {
            return;
        }
        
        room.currentQuestion = stage;
        room.stage = stage;
        
        // Update all players' stages
        room.players.forEach(player => {
            player.currentStage = stage;
        });
        
        // Send question to all players in the room
        socket.to(roomCode).emit('question', { stage });
        socket.emit('question-sent', { stage });
        
        console.log(`Question ${stage} sent to room ${roomCode}`);
    });

    // Player submits an answer
    socket.on('submit-answer', (data) => {
        const { roomCode, stage, choice } = data;
        const room = rooms.get(roomCode);
        
        if (!room) {
            return;
        }
        
        const player = room.players.get(socket.id);
        if (!player) {
            return;
        }
        
        // Update player's answer
        player.answers[stage - 1] = choice;
        player.currentStage = stage;
        
        // Notify admin about the answer
        io.to(room.adminId).emit('player-answer', {
            playerId: socket.id,
            playerName: player.name,
            stage: stage,
            choice: choice,
            totalAnswered: countAnswered(room, stage)
        });
        
        console.log(`Player ${player.name} answered stage ${stage} in room ${roomCode}`);
    });

    // Admin requests player progress
    socket.on('get-progress', (data) => {
        const { roomCode } = data;
        const room = rooms.get(roomCode);
        
        if (!room || socket.id !== room.adminId) {
            return;
        }
        
        const progress = Array.from(room.players.values()).map(player => ({
            name: player.name,
            stage: player.currentStage,
            answers: player.answers
        }));
        
        socket.emit('progress-data', { progress });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove player from rooms
        for (const [roomCode, room] of rooms.entries()) {
            if (room.players.has(socket.id)) {
                const player = room.players.get(socket.id);
                room.players.delete(socket.id);
                
                // Notify admin
                io.to(room.adminId).emit('player-left', {
                    playerName: player.name,
                    totalPlayers: room.players.size
                });
                
                // Delete room if admin left
                if (socket.id === room.adminId) {
                    rooms.delete(roomCode);
                    io.to(roomCode).emit('admin-left');
                }
            }
        }
    });
});

// Helper function to count answered players for a stage
function countAnswered(room, stage) {
    let count = 0;
    room.players.forEach(player => {
        if (player.answers[stage - 1]) {
            count++;
        }
    });
    return count;
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

