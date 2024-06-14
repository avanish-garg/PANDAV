import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import process from 'process';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io

// Import routes
import authRoutes from './routes/authRoutes';

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Use routes
app.use('/api', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust according to your needs
    methods: ["GET", "POST"]
  }
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle joining a specific document room
  socket.on('joinDocument', (documentId) => {
    socket.join(documentId);
    console.log(`User joined document: ${documentId}`);
    // Notify others in the room that a new user has joined
    socket.to(documentId).emit('userJoined', { userId: socket.id, documentId });
  });

  // Handle document changes
  socket.on('documentChange', (data) => {
    const { documentId, content } = data;
    // Broadcast changes to all clients in the same document room, except the sender
    socket.to(documentId).emit('documentUpdate', { documentId, content });
  });

  // Handle leaving a document room
  socket.on('leaveDocument', (documentId) => {
    socket.leave(documentId);
    console.log(`User left document: ${documentId}`);
    // Notify others in the room that a user has left
    socket.to(documentId).emit('userLeft', { userId: socket.id, documentId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Optionally, handle cleanup, such as notifying other users, saving state, etc.
  });
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen to include socket.io in the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});