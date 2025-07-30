// src/autor/application/services/UserService.ts
import { AppDataSource } from '../../../database/data-source';
import { User } from '../../application/domain/entities/User';
import bcrypt from 'bcrypt'; // Asegúrate de instalar bcrypt
import jwt from 'jsonwebtoken'; // Asegúrate de instalar jsonwebtoken

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async deleteUser(username: string): Promise<void> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.remove(user);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  generateToken(user: User): string {
    return jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, 'your_jwt_secret');
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
