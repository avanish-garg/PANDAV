import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Use your server URL here

const DocumentEditor = ({ documentId }) => {
  const [document, setDocument] = useState({ title: '', content: '' });

  useEffect(() => {
    // Fetch the document initially and on documentId change
    const fetchDocument = async () => {
      const response = await axios.get(`http://localhost:3000/documents/${documentId}`);
      setDocument(response.data);
    };

    fetchDocument();

    // Listen for real-time updates
    socket.on('documentUpdated', (updatedDocument) => {
      if (updatedDocument._id === documentId) {
        setDocument(updatedDocument);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('documentUpdated');
    };
  }, [documentId]);

  const handleContentChange = (e) => {
    const updatedContent = e.target.value;
    setDocument((prevDocument) => ({ ...prevDocument, content: updatedContent }));

    // Emit the update event
    socket.emit('documentUpdate', { documentId, newContent: updatedContent });
  };

  return (
    <div>
      <h2>Editing: {document.title}</h2>
      <textarea
        value={document.content}
        onChange={handleContentChange}
        rows="10"
        cols="50"
      ></textarea>
    </div>
  );
};

export default DocumentEditor;