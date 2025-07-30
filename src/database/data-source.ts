import { DataSource } from 'typeorm';
import { User } from '../autor/application/domain/entities/User';
import { EventEntity } from '../autor/application/domain/entities/events/EventEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost', // Verifica que esta IP sea correcta
  port: 3306,
  username: 'Plants', // Verifica que este usuario exista y tenga permisos
  password: 'Plants32', 
  database: 'Plants',
  entities: [User, EventEntity],
  synchronize: false,
  logging: true,
  driver: require('mysql2'),
});
