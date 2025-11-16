//Manas Mankar //lab1 assignment

const request = require('supertest');
const app = require('../../server'); // relative path to server.js

describe('Auth Routes - Signup', () => {
  it('should signup a new user successfully', async () => {
    const uniqueUsername = `manas${Date.now()}`;
    const uniqueEmail = `manas${Date.now()}@gmail.com`;
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "Manas Mankar",
        username: uniqueUsername,
        email: uniqueEmail,
        password: "Manas221"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Manas Mankar');
    expect(res.body).toHaveProperty('username', uniqueUsername);
    expect(res.body).toHaveProperty('email', uniqueEmail);
  });

  it('should not allow signup with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        // name is missing
        username: "testuser_missing",
        email: "missing@example.com",
        password: "Manas221"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'All fields are required');
  });

  it('should not allow duplicate email or username', async () => {
    // First signup
    await request(app)
      .post('/api/auth/signup')
      .send({
        name: "Duplicate User",
        username: "dupuser",
        email: "dup@example.com",
        password: "Manas221"
      });
    
    // Second signup with same email
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: "Duplicate User Again",
        username: "dupuser2",
        email: "dup@example.com", // same email
        password: "Manas221"
      });
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error'); // "User already exists" or similar
  });
});