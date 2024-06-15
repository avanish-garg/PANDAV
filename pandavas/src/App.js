import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import QuillEditor from './components/QuillEditor'; // Import the QuillEditor component
import DocumentEditor from './components/DocumentEditor'; // Import the DocumentEditor component
import ProfilePage from './components/ProfilePage'; // Step 2: Import the ProfilePage component
import 'bootstrap/dist/css/bootstrap.min.css';

// Assuming your Socket.IO server is running on this URL
const SOCKET_URL = 'http://localhost:4000';

function App() {
  useEffect(() => {
    // Connect to Socket.IO server
    const socket = io(SOCKET_URL);

    // Common event handlers
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Example custom event handler
    socket.on('message', (message) => {
      console.log('New message:', message);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/quill" element={<QuillEditor />} /> {/* Updated route for the QuillEditor */}
        <Route path="/editor/document/:documentId" element={<DocumentEditor />} /> {/* New route for the DocumentEditor */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Step 3: New route for the ProfilePage */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;