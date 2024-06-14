import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
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
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;