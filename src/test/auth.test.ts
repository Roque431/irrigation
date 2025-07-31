import request from 'supertest';
import app from '../src/app'; // Ajusta el path según tu estructura
import { describe } from 'node:test';

describe('🔐 Auth Endpoints - /register & /login', () => {

  const user = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Test1234'
  };

  it('AU01 - Registro exitoso', async () => {
    const res = await request(app)
      .post('/register')
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('AU02 - Registro con campos vacíos', async () => {
    const res = await request(app)
      .post('/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('AU03 - Registro con email duplicado', async () => {
    const res = await request(app)
      .post('/register')
      .send(user);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('AU04 - Login exitoso', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('AU05 - Login con clave incorrecta', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: 'WrongPassword'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('AU06 - Login con usuario inexistente', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'SomePass123'
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('AU07 - Login con campos vacíos', async () => {
    const res = await request(app)
      .post('/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('AU08 - Validar estructura del token', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password
      });

    const token = res.body.token;
    expect(token).toBeDefined();
    const parts = token.split('.');
    expect(parts.length).toBe(3); // JWT tiene 3 partes
  });

});
