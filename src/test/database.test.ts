import { DataSource } from 'typeorm';
import request from 'supertest';
import app from '../src/app';

const testDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'roque42',
  password: 'roque4232',
  database: 'irrigation_test',
  entities: ['src/entity/*.ts'],
  synchronize: true,
});

describe('🗄️ Base de Datos - Conexión y CRUD', () => {
  
  it('DB01 - Conexión a la base de datos', async () => {
    await expect(testDataSource.initialize()).resolves.not.toThrow();
  });

  it('DB02 - Inicialización correcta', async () => {
    const isInitialized = testDataSource.isInitialized;
    expect(isInitialized).toBe(true);
  });

  it('DB03 - Manejo de error en conexión', async () => {
    const brokenSource = new DataSource({
      ...testDataSource.options,
      password: 'wrongpass'
    });

    await expect(brokenSource.initialize()).rejects.toThrow();
  });

  it('DB04 - Operaciones CRUD básicas', async () => {
    // Crear
    const create = await request(app).post('/dispositivos').send({
      nombre: 'Test Dispositivo',
      ubicacion: 'Zona A',
      estado: 'activo'
    });
    expect(create.status).toBe(201);

    const id = create.body.id;

    // Leer
    const read = await request(app).get(`/dispositivos/${id}`);
    expect(read.status).toBe(200);

    // Actualizar
    const update = await request(app).patch(`/dispositivos/${id}`).send({ estado: 'inactivo' });
    expect(update.status).toBe(200);

    // Eliminar
    const del = await request(app).delete(`/dispositivos/${id}`);
    expect(del.status).toBe(200);
  });

  it('DB05 - Optimización de consulta (tiempo de respuesta)', async () => {
    const start = Date.now();
    const res = await request(app).get('/dispositivos');
    const duration = Date.now() - start;

    expect(res.status).toBe(200);
    expect(duration).toBeLessThanOrEqual(500); // tiempo máximo aceptable en ms
  });

});
