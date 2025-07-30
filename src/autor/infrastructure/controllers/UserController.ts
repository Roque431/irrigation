// src/autor/infrastructure/controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../application/services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      // Verifica si el nombre de usuario ya existe
      const existingUser = await this.userService.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Crea un nuevo usuario
      const user = await this.userService.createUser(username, password);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      const user = await this.userService.findUserByUsername(username);
      if (user && await this.userService.verifyPassword(user, password)) {
        const token = this.userService.generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}