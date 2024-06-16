import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  let navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadDocument = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Ensure the key matches the server expectation

    try {
      const response = await fetch('http://localhost:5000/upload', { // Correct URL
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.documentId) {
        navigateToDocumentEditor(data.documentId);
      } else {
        alert('Failed to upload document.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document.');
    }
  };

  const navigateToDocumentEditor = (documentId) => {
    navigate(`/edit-document/${documentId}`);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadDocument}>Upload and Edit Document</button>
    </div>
  );
};

export default Dashboard;
