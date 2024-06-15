import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import process from 'process';
// Import routes
import authRoutes from './routes/authRoutes';
// Import the Document model
import Document from './models/Document'; // Ensure this path is correct

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io

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
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  // Additional event handlers can be added here
});

// POST endpoint for creating a new document
app.post('/documents', async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({ title, content });
    await document.save();
    io.emit('documentCreated', document); // Emit an event for the new document
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET endpoint for retrieving all documents
app.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET endpoint for retrieving a specific document by id
app.get('/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
    } else {
      res.status(200).json(document);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen to include socket.io in the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});