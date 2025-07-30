// src/autor/application/domain/entities/events/EventEntity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('eventos')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  timestamp: Date;

  @Column('float')
  distance: number;

  @Column()
  soilhumidity: string;

  @Column()
  mensaje: string;

  constructor(timestamp: Date, distance: number, soilhumidity: string, mensaje: string) {
    this.timestamp = timestamp;
    this.distance = distance;
    this.soilhumidity = soilhumidity;
    this.mensaje = mensaje;
  }
}
