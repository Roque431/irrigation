// src/autor/infrastructure/controllers/EventController.ts
import { Request, Response } from 'express';
import { EventService } from '../../application/domain/entities/events/EventService';
import { EventEntity } from '../../application/domain/entities/events/EventEntity';

export class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

  async createEvent(req: Request, res: Response): Promise<Response> {
    try {
      const { timestamp, distance, soilhumidity, mensaje} = req.body;
      const event = new EventEntity(new Date(timestamp), distance, soilhumidity, mensaje);
      const newEvent = await this.eventService.createEvent(event);
      return res.status(201).json(newEvent);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating event', error });
    }
  }

  async getAllEvents(req: Request, res: Response): Promise<Response> {
    try {
      const events = await this.eventService.getAllEvents();
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching events', error });
    }
  }

  async getEventById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(Number(id));
      if (event !== undefined) { 
        return res.status(200).json(event);
      } else {
        return res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching event', error });
    }
  }
}
