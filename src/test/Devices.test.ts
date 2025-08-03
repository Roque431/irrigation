import request from 'supertest';
import app from '../src/app';

describe(' API Dispositivos de Riego - /devices', () => {
  
  let deviceId: number;

  it('DV01 - Añadir nuevo dispositivo', async () => {
    const res = await request(app).post('/devices').send({
      nombre: 'Dispositivo Lotes 1',
      ubicacion: 'Zona A',
      estado: 'activo'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    deviceId = res.body.id;
  });

  it('DV02 - Validación de campos en creación', async () => {
    const res = await request(app).post('/devices').send({
      nombre: '',
      ubicacion: ''
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('DV03 - Eliminar dispositivo existente', async () => {
    const create = await request(app).post('/devices').send({
      nombre: 'Temporal',
      ubicacion: 'Prueba',
      estado: 'inactivo'
    });

    const del = await request(app).delete(`/devices/${create.body.id}`);
    expect(del.status).toBe(200);
    expect(del.body.message).toMatch(/eliminado/i);
  });

  it('DV04 - Configurar parámetros del dispositivo', async () => {
    const res = await request(app).patch(`/devices/${deviceId}/config`).send({
      horarios: ['06:00', '18:00'],
      modo: 'automático'
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('config');
  });

  it('DV05 - Obtener estado del dispositivo', async () => {
    const res = await request(app).get(`/devices/${deviceId}/status`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('conectado');
    expect(res.body).toHaveProperty('activo');
  });

  it('DV06 - Mostrar dispositivos en UI', async () => {
    const res = await request(app).get('/devices');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('estado');
  });

});
