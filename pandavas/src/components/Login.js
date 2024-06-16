import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import custom CSS for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        email,
        password,
      });
      console.log('Login successful', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error.response ? error.response.data : 'No response');
      setError(error.response ? error.response.data.message : 'Login failed with no response');
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="login-bg">
      <Container>
        <div className="login-container">
          <h2 className="login-heading">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className="submit-button" variant="primary" type="submit">
              Submit
            </Button>

            <Button className="signup-button" variant="link" onClick={handleSignupClick}>
              Isn't registered? Sign up here.
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
