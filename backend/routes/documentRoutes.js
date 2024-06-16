import express from 'express';
import Document from '../models/Document.js';

const router = express.Router();

// Post a new document
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

// Update an existing document
router.put('/documents/:id', async (req, res) => {
  try {
    const updates = req.body;
    const document = await Document.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!document) {
      return res.status(404).send('Document not found');
    }
    res.send(document);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;