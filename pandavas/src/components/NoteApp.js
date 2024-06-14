// components/NoteApp.js
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { NoteForm } from './NoteForm';
import { NoteList } from './NoteList';
import noteService from '../services/noteService';

function NoteApp() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const fetchedNotes = await noteService.getNotes();
    setNotes(fetchedNotes);
  };

  const handleNoteSubmit = async (noteData) => {
    await noteService.createNote(noteData);
    fetchNotes(); // Refresh the list of notes after adding a new one
  };

  // Fetch notes on component mount
  useState(() => {
    fetchNotes();
  }, []);

  return (
    <Container>
      <h1>Notes App</h1>
      <NoteForm onSubmit={handleNoteSubmit} />
      <NoteList notes={notes} setNotes={setNotes} />
    </Container>
  );
}

export default NoteApp;

