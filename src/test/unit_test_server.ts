import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server'; // Assuming your server.ts exports the express app

describe('User API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('message', 'User registered successfully');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message', 'Login successful');
  });
});

describe('Event API', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        name: 'Test Event',
        date: '2025-12-31',
      });
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('message', 'Event created successfully');
  });

  it('should get all events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});

