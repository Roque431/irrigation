import 'reflect-metadata';
import express from 'express';
import cors from 'cors'; // Importa el middleware de CORS
import { AppDataSource } from './database/data-source';
import { UserController } from './autor/infrastructure/controllers/UserController';
import { EventController } from './autor/infrastructure/controllers/EventController';
import { EventService } from './autor/application/domain/entities/events/EventService';

// Inicializa los controladores
const app = express();
const port = 3000;
const userController = new UserController();
const eventService = new EventService();
const eventController = new EventController(eventService);
 
app.use(cors()); // Utiliza el middleware de CORS
app.use(express.json());

// Rutas para usuarios
app.post('/register', (req, res) => userController.createUser(req, res)); // Ruta para registrar un usuario
app.post('/login', (req, res) => userController.login(req, res));       // Ruta para iniciar sesión

// Rutas para eventos
app.post('/events', (req, res) => eventController.createEvent(req, res)); // Ruta para crear un evento
app.get('/events', (req, res) => eventController.getAllEvents(req, res)); // Ruta para obtener todos los eventos

// Inicializa la base de datos y el servidor
AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database!');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.log('Database connection error:', error));

