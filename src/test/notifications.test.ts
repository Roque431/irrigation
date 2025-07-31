import request from 'supertest';
import app from '../src/app';

describe('🔔 Sistema de Notificaciones', () => {

  const testNotification = {
    titulo: 'Alerta de riego',
    mensaje: 'Se ha iniciado el riego en el lote 5',
    fecha: '2025-08-01T12:00:00Z',
    userId: 1
  };

  it('NT01 - Guardar notificación correctamente', async () => {
    const res = await request(app)
      .post('/notifications')
      .send(testNotification);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.titulo).toBe('Alerta de riego');
  });

  it('NT02 - Enviar notificación al evento riego', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        tipo: 'riego',
        fecha: '2025-08-01',
        descripcion: 'Inicio automático de riego'
      });

    expect(res.status).toBe(201);
    // Opcional: verificar si una notificación fue generada en backend o usar mocking
  });

  it('NT03 - Mostrar notificaciones en interfaz (GET)', async () => {
    const res = await request(app)
      .get('/notifications?userId=1');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('NT04 - Preferencias activadas/desactivadas', async () => {
    await request(app).post('/users/1/preferences').send({ notifications: false });

    const eventRes = await request(app)
      .post('/events')
      .send({
        tipo: 'alerta',
        fecha: '2025-08-01',
        descripcion: 'Alerta sin notificación'
      });

    expect(eventRes.status).toBe(201);
    // Simulación: notificación NO debe ser enviada ni guardada
  });

  it('NT05 - Envío a múltiples usuarios', async () => {
    const res = await request(app)
      .post('/notifications/broadcast')
      .send({
        titulo: 'Mantenimiento programado',
        mensaje: 'Corte de agua por 2h',
        fecha: '2025-08-02T10:00:00Z'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('NT06 - Validar estructura de notificación', async () => {
    const res = await request(app)
      .get('/notifications?userId=1');

    const noti = res.body[0];
    expect(noti).toHaveProperty('titulo');
    expect(noti).toHaveProperty('mensaje');
    expect(noti).toHaveProperty('fecha');
  });

});
