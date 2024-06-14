import express from 'express';
import Note from '../models/Note';

const router = express.Router();

// Create a new note
router.post('/notes', async (req, res) => {
  try {
    const note = new Note({ ...req.body, author: req.user._id });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all notes for the logged-in user
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user._id });
    res.send(notes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a note
router.patch('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, author: req.user._id }, req.body, { new: true });
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;