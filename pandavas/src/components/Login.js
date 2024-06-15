import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        email,
        password,
      });
      console.log('Login successful', response.data);
      if (response.data.isRegistered) {
        navigate('/DocumentEditorPage'); // Navigate to /DocumentEditorPage route upon successful login
      } else {
        navigate('/signup');
      }
    } catch (error) {
      console.error('Login failed', error.response ? error.response.data : 'No response');
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
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

        <Button variant="primary" type="submit">
          Submit
        </Button>

        <Button variant="link" onClick={handleSignupClick}>
          Isn't registered? Sign up here.
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
