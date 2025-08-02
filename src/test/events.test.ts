import request from 'supertest';
import app from '../src/app'; // Asegúrate de que este path apunta a tu instancia de Express

describe('📅 API de Eventos - /events', () => {

  const sampleEvent = {
    tipo: 'riego',
    fecha: '2025-08-01',
    descripcion: 'Riego programado para el lote 3'
  };

  it('EV01 - Crear evento exitosamente', async () => {
    const res = await request(app)
      .post('/events')
      .send(sampleEvent);

    expect(res.status).toBe(205);
    expect(res.body).toHaveProperty('id');
    expect(res.body.tipo).toBe(sampleEvent.tipo);
  });

  it('EV02 - Crear evento con campos vacíos', async () => {
    const res = await request(app)
      .post('/events')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('EV03 - Obtener todos los eventos', async () => {
    const res = await request(app)
      .get('/events');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('EV04 - Filtrar eventos por fecha', async () => {
    const res = await request(app)
      .get('/events')
      .query({ fecha: '2025-08-01' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const event of res.body) {
      expect(event.fecha).toBe('2025-08-01');
    }
  });

  it('EV05 - Filtrar eventos por tipo', async () => {
    const res = await request(app)
      .get('/events')
      .query({ tipo: 'riego' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const event of res.body) {
      expect(event.tipo).toBe('riego');
    }
  });

  it('EV06 - Validar datos mostrados en UI', async () => {
    const res = await request(app)
      .get('/events');

    const evento = res.body.find((e: any) => e.descripcion === sampleEvent.descripcion);
    expect(evento).toBeDefined();
    expect(evento.fecha).toBe('2025-08-01');
  });

});
