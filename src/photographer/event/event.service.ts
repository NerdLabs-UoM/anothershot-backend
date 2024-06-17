import { Injectable, Logger } from '@nestjs/common';
import { createEventDto } from './dto/createEvent.dto';
import { updateEventDto } from './dto/updateEvent.dto';
import { deleteEventDto } from './dto/deleteEvent.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
   //------- event services ---------
   private readonly logger = new Logger(EventService.name);

   constructor(
     private prisma: PrismaService,
     
   ) { }
   async createEvents(dto: createEventDto) {
    try {
      this.logger.log(`Creating event with booking ID: ${dto.bookingId}`);
      const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
      if (!booking) {
        this.logger.warn(`Booking not found with ID: ${dto.bookingId}`);
        throw new Error('Booking not found');
      }
      const newEvent = await this.prisma.event.create({
        data: {
          title: dto.title,
          Booking: {
            connect: {
              id: dto.bookingId,
            },
          },
          description: dto.description,
          start: dto.start,
          end: dto.end,
          allDay: dto.allDay,
        },
      });
      this.logger.log(`Event created successfully with booking ID: ${dto.bookingId}`);
      return newEvent;
    } catch (error) {
      this.logger.error(`Error creating event with booking ID: ${dto.bookingId}`, error);
      throw error;
    }
  }


  async getEvents(id: string) {
    try {
      this.logger.log(`Fetching events for photographer ID: ${id}`);
      const events = await this.prisma.event.findMany({
        where: {
          Booking: {
            photographerId: id,
          },
        },
      });
      this.logger.log(`Events fetched successfully for photographer ID: ${id}`);
      return events;
    } catch (error) {
      this.logger.error(`Error fetching events for photographer ID: ${id}`, error);
      throw error;
    }
  }

  async getEventById(eventId: string) {
    try {
      this.logger.log(`Fetching event with ID: ${eventId}`);
      const event = await this.prisma.package.findUnique({
        where: {
          id: eventId,
        },
      });
      if (!event) {
        this.logger.warn(`Event not found with ID: ${eventId}`);
        throw new Error(`Event with ID ${eventId} not found`);
      }
      this.logger.log(`Event fetched successfully with ID: ${eventId}`);
      return event;
    } catch (error) {
      this.logger.error(`Error fetching event with ID: ${eventId}`, error);
      throw error;
    }
  }

  async updateEvents(dto: updateEventDto) {
    try {
      this.logger.log(`Updating event with ID: ${dto.eventId}`);
      const updatedEvent = await this.prisma.event.update({
        where: {
          id: dto.eventId,
        },
        data: {
          title: dto.title,
          description: dto.description,
          start: dto.start,
          end: dto.end,
          allDay: dto.allDay,
        },
      });
      this.logger.log(`Event updated successfully with ID: ${dto.eventId}`);
      return updatedEvent;
    } catch (error) {
      this.logger.error(`Error updating event with ID: ${dto.eventId}`, error);
      throw error;
    }
  }
  

  async deleteEvents(dto: deleteEventDto) {
    try {
      this.logger.log(`Deleting event with ID: ${dto.id}`);
      const deletedEvent = await this.prisma.event.delete({
        where: {
          id: dto.id,
        },
      });
      this.logger.log(`Event deleted successfully with ID: ${dto.id}`);
      return deletedEvent;
    } catch (error) {
      this.logger.error(`Error deleting event with ID: ${dto.id}`, error);
      throw error;
    }
  }
}
