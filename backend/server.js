import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import process from 'process';
import multer from 'multer'; // Import multer
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js'; // Import document routes
import Document from './models/Document.js'; // Ensure this path is correct
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server for socket.io

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Convert the import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);

// Derive the directory name
const __dirname = path.dirname(__filename);

// Now you can use __dirname to define uploadsDir
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Use routes
app.use('/api', authRoutes);
app.use('/api', documentRoutes); // Use document routes

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

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Here you can generate a unique ID if needed, but MongoDB's _id can also serve this purpose
  // Save file metadata in MongoDB
  const newDocument = new Document({
    title: req.body.title, // Assuming you want to include a title
    content: req.file.path, // Save the file path as content or add a new field for the path
    // Add other metadata as needed
  });

  try {
    await newDocument.save();
    // You can return the MongoDB _id as the unique ID
    res.status(201).json({ documentId: newDocument._id, filePath: req.file.path });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).send('Error saving document.');
  }
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen to include socket.io in the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
