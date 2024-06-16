import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './Dashboard.css'; // Import custom CSS for styling

const Dashboard = () => {
  const navigate = useNavigate();
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
    formData.append('file', file);  // Ensure 'file' matches the key in server

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.documentId) {
        navigate(`/edit-document/${data.documentId}`);
      } else {
        alert('Failed to upload document.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document.');
    }
  };

  return (
    <div className="dashboard-bg">
      <Container>
        <div className="dashboard-container">
          <h1>Dashboard</h1>
          <input type="file" onChange={handleFileChange} />
          <Button className="upload-button" onClick={uploadDocument}>Upload and Edit Document</Button>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
