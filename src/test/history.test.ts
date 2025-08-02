import request from 'supertest';
import app from '../src/app';

describe(' API Historial de Riegosss con base - /history', () => {

  it('HS01 - Almacenar datos históricos', async () => {
    const res = await request(app)
      .post('/history')
      .send({
        cantidad: 300,
        duracion: 45,
        fecha: '2025-08-03',
        cultivo: 'maíz'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('HS02 - Obtener historial completo', async () => {
    const res = await request(app).get('/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('HS03 - Filtrar por fecha', async () => {
    const res = await request(app)
      .get('/history?from=2025-08-01&to=2025-08-10');
    
    expect(res.status).toBe(200);
    for (const registro of res.body) {
      expect(new Date(registro.fecha) >= new Date('2025-08-01')).toBe(true);
      expect(new Date(registro.fecha) <= new Date('2025-08-10')).toBe(true);
    }
  });

  it('HS04 - Filtrar por tipo de cultivo', async () => {
    const res = await request(app)
      .get('/history?cultivo=maíz');

    expect(res.status).toBe(200);
    for (const registro of res.body) {
      expect(registro.cultivo).toBe('maíz');
    }
  });

  it('HS06 - Exportar historial en CSV', async () => {
    const res = await request(app)
      .get('/history/export?format=csv');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
  });

  it('HS07 - Exportar historial en PDF', async () => {
    const res = await request(app)
      .get('/history/export?format=pdf');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });

});
