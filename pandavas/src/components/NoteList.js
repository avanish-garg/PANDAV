// components/NoteList.js
import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import noteService from '../services/noteService';

function NoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    noteService.getNotes().then((data) => setNotes(data));
  }, []);

  const handleDelete = async (id) => {
    await noteService.deleteNote(id);
    setNotes(notes.filter((note) => note._id !== id));
  };

  return (
    <ListGroup>
      {notes.map((note) => (
        <ListGroup.Item key={note._id}>
          <h4>{note.title}</h4>
          <p>{note.content}</p>
          <Button variant="danger" onClick={() => handleDelete(note._id)}>
            Delete
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export { NoteList };