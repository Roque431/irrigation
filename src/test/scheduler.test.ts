import request from 'supertest';
import app from '../src/app';

describe('🕒 Sistema de Programación de Riego - /scheduler', () => {

  it('SC01 - Crear programación basada en clima', async () => {
    const res = await request(app)
      .post('/scheduler')
      .send({
        zona: 'Zona 1',
        cultivo: 'maíz',
        clima: 'sin lluvia',
        horarios: ['06:00', '18:00']
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.zona).toBe('Zona 1');
  });

  it('SC02 - Obtener programas por zona', async () => {
    const res = await request(app).get('/scheduler?zona=Zona 1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((p: any) => {
      expect(p.zona).toBe('Zona 1');
    });
  });

  it('SC03 - Integrar datos de humedad del suelo', async () => {
    const res = await request(app)
      .post('/sensor/humedad')
      .send({ zona: 'Zona 1', humedad: 90 });

    expect(res.status).toBe(200);
    expect(res.body.accion).toMatch(/pausar|ajustar/i);
  });

  it('SC04 - Crear múltiples programas por zona', async () => {
    const program1 = await request(app).post('/scheduler').send({
      zona: 'Zona 2',
      cultivo: 'trigo',
      clima: 'seco',
      horarios: ['07:00']
    });

    const program2 = await request(app).post('/scheduler').send({
      zona: 'Zona 2',
      cultivo: 'maíz',
      clima: 'soleado',
      horarios: ['19:00']
    });

    expect(program1.status).toBe(201);
    expect(program2.status).toBe(201);
  });

  it('SC05 - Ajuste automático del horario de riego', async () => {
    const res = await request(app)
      .post('/scheduler/ajuste')
      .send({
        zona: 'Zona 1',
        nuevaCondicion: 'lluvia'
      });

    expect(res.status).toBe(200);
    expect(res.body.ajustado).toBe(true);
  });

  it('SC06 - Visualización de programación en interfaz', async () => {
    const res = await request(app).get('/scheduler');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('horarios');
    expect(res.body[0]).toHaveProperty('clima');
  });

});
