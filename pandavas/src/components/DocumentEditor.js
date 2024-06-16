// DocumentEditor.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom'; // Import useParams
import './DocumentEditor.css';

const socket = io('http://localhost:5000'); // Use your server URL here

const DocumentEditor = () => {
  const { documentId } = useParams(); // Get documentId from route params
  const [document, setDocument] = useState({ title: '', content: '' });

  useEffect(() => {
    if (documentId) {
      const fetchDocument = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/documents/${documentId}`);
          setDocument(response.data);
        } catch (error) {
          console.error('Failed to fetch document:', error);
        }
      };

      fetchDocument();

      socket.on('documentUpdated', (updatedDocument) => {
        if (updatedDocument._id === documentId) {
          setDocument(updatedDocument);
        }
      });

      return () => {
        socket.off('documentUpdated');
      };
    } else {
      console.error('Document ID is undefined');
    }
  }, [documentId]);

  const saveDocument = debounce(async (newContent) => {
    try {
      await axios.put(`http://localhost:5000/documents/${documentId}`, { content: newContent });
      console.log('Document saved');
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  }, 1000);

  const handleContentChange = (e) => {
    const updatedContent = e.target.value;
    setDocument(prevDocument => ({ ...prevDocument, content: updatedContent }));
    socket.emit('documentUpdate', { documentId, newContent: updatedContent });
    saveDocument(updatedContent);
  };

  return (
    <div className="document-editor-bg">
      <div className="document-editor-container">
        <h2>Editing: {document.title}</h2>
        <textarea
          className="editor-textarea"
          value={document.content}
          onChange={handleContentChange}
          rows="10"
          cols="50"
        ></textarea>
        <p className="save-message">Changes are automatically saved.</p>
      </div>
    </div>
  );
};

export default DocumentEditor;
