// src/autor/application/domain/entities/events/EventService.ts// Asegúrate de la ruta correcta
import { AppDataSource } from "../../../../../database/data-source";
import { EventEntity } from './EventEntity';


export class EventService {
    private eventRepository = AppDataSource.getRepository(EventEntity);
  
    async createEvent(event: EventEntity): Promise<EventEntity> {
      return this.eventRepository.save(event);
    }
  
    async getAllEvents(): Promise<EventEntity[]> {
      return this.eventRepository.find();
    }
  
    async getEventById(id: number): Promise<EventEntity | undefined> {
      const event = await this.eventRepository.findOneBy({ id });
      return event ?? undefined; // Convierte null a undefined
    }
  }
