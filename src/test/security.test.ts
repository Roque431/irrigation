import request from 'supertest';
import app from '../src/app';

describe('🔐 Seguridad del Sistema - Pruebas de Seguridad', () => {

  const user = {
    email: 'secureuser@example.com',
    password: 'SecurePass123!',
    code2FA: '123456' // Simulado
  };

  it('SE01 - Autenticación de dos factores (2FA)', async () => {
    const login = await request(app)
      .post('/login')
      .send({ email: user.email, password: user.password });

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('requires2FA', true);
  });

  it('SE02 - Contraseña encriptada en base de datos', async () => {
    const register = await request(app)
      .post('/register')
      .send(user);

    expect(register.status).toBe(201);
    // Este test requiere acceso mock o directo a base de datos para verificar el hash
  });

  it('SE03 - Registro de actividad sospechosa', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/login')
        .send({ email: user.email, password: 'wrongpass' });
    }

    const res = await request(app).get('/audit-log?email=secureuser@example.com');
    expect(res.status).toBe(200);
    expect(res.body.some((log: any) => log.tipo === 'INTENTOS_FALLIDOS')).toBe(true);
  });

  it('SE04 - Prevención de inyección SQL', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: "' OR 1=1--", password: "hacked" });

    expect(res.status).toBe(401);
  });

  it('SE05 - Prevención de XSS', async () => {
    const res = await request(app)
      .post('/profile')
      .send({ bio: '<script>alert("xss")</script>' });

    expect(res.status).toBe(200);
    expect(res.body.bio).not.toContain('<script>');
  });

  it('SE06 - Contraseña débil rechazada o advertida', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'testweak@example.com', password: '123456' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.message).toMatch(/débil/i);
  });

});
