// App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import QuillEditor from './components/QuillEditor';
import DocumentEditor from './components/DocumentEditor';
import ProfilePage from './components/ProfilePage';
import 'bootstrap/dist/css/bootstrap.min.css';

const SOCKET_URL = 'http://localhost:5000';

function App() {
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

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
        <Route path="/editor/quill" element={<QuillEditor />} />
        <Route path="/edit-document/:documentId" element={<DocumentEditor />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
