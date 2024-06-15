import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';

const ProfilePage = () => {
  // Placeholder data - replace with actual data from your backend or state management
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Welcome to Projex by Pandavas.CSE',
    profilePictureUrl: 'https://via.placeholder.com/150', // Placeholder image
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={userProfile.profilePictureUrl} />
            <Card.Body>
              <Card.Title>{userProfile.name}</Card.Title>
              <Card.Text>{userProfile.bio}</Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>Email: {userProfile.email}</ListGroup.Item>
            </ListGroup>
            <Card.Body>
              <Button variant="primary">Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;