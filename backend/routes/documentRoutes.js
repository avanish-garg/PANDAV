// documentRoutes.js

import express from 'express';
import Document from '../models/Document.js';

const router = express.Router();

// POST a new document
router.post('/documents', async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({ title, content });
    await document.save();
    res.status(201).send(document);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// PUT update an existing document
router.put('/documents/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const document = await Document.findByIdAndUpdate(req.params.id, { content }, { new: true });
    if (!document) {
      return res.status(404).send('Document not found');
    }
    res.send(document);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET all documents
router.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET a specific document by id
router.get('/documents/:id', async (req, res) => {
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

export default router;
