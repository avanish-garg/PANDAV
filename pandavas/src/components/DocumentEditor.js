import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { debounce } from 'lodash';

const socket = io('http://localhost:3000'); // Use your server URL here

const DocumentEditor = ({ documentId }) => {
  const [document, setDocument] = useState({ title: '', content: '' });

  useEffect(() => {
    // Fetch the document initially and on documentId change
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/documents/${documentId}`);
        setDocument(response.data);
      } catch (error) {
        console.error('Failed to fetch document:', error);
      }
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

  // Debounced save function
  const saveDocument = debounce(async (newContent) => {
    try {
      await axios.put(`http://localhost:3000/documents/${documentId}`, { content: newContent });
      console.log('Document saved');
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  }, 1000); // Adjust debounce time as needed

  const handleContentChange = (e) => {
    const updatedContent = e.target.value;
    setDocument((prevDocument) => ({ ...prevDocument, content: updatedContent }));

    // Emit the update event
    socket.emit('documentUpdate', { documentId, newContent: updatedContent });

    // Save the document after debounce
    saveDocument(updatedContent);
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