import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { EventService } from './event.service';
import { deleteEventDto } from './dto/deleteEvent.dto';
import { updateEventDto } from './dto/updateEvent.dto';
import { createEventDto } from './dto/createEvent.dto';

@Controller('api/photographer')
export class EventController {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly eventService: EventService) {}

  //------- event controllers ---------

  @Post(':id/event/create')
  async createEvents(@Body() dto: createEventDto) {
    try {
      this.logger.log(
        `Creating event for photographer with ID: ${dto.bookingId}`
      );
      const createdEvent = await this.eventService.createEvents(dto);
      this.logger.log(
        `Event created successfully for photographer with ID: ${dto.bookingId}`
      );
      return createdEvent;
    } catch (error) {
      this.logger.error(
        `Error creating event for photographer with ID: ${dto.bookingId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem creating the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/event/get')
  async getEvents(@Param('id') eventId: string) {
    try {
      this.logger.log(`Fetching events for photographer with ID: ${eventId}`);
      const events = await this.eventService.getEvents(eventId);
      this.logger.log(
        `Events fetched successfully for photographer with ID: ${eventId}`
      );
      return events;
    } catch (error) {
      this.logger.error(
        `Error fetching events for photographer with ID: ${eventId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the events.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/event/getEventById')
  async getEventById(@Param('eventId') eventId: string) {
    try {
      this.logger.log(`Fetching event by ID: ${eventId}`);
      const event = await this.eventService.getEventById(eventId);
      this.logger.log(`Event with ID ${eventId} fetched successfully`);
      return event;
    } catch (error) {
      this.logger.error(
        `Error fetching event with ID ${eventId}: ${error.message}`
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/event/update')
  async updateEvents(@Body() dto: updateEventDto) {
    try {
      this.logger.log(`Updating event with ID: ${dto.eventId}`);
      const updatedEvent = await this.eventService.updateEvents(dto);
      this.logger.log(`Event with ID ${dto.eventId} updated successfully`);
      return updatedEvent;
    } catch (error) {
      this.logger.error(
        `Error updating event with ID ${dto.eventId}: ${error.message}`
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id/event/delete')
  async deleteEvents(@Body() dto: deleteEventDto) {
    try {
      this.logger.log(`Deleting event with ID: ${dto.id}`);
      await this.eventService.deleteEvents(dto);
      this.logger.log(`Event with ID ${dto.id} deleted successfully`);
      return { message: `Event with ID ${dto.id} deleted successfully` };
    } catch (error) {
      this.logger.error(
        `Error deleting event with ID ${dto.id}: ${error.message}`
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem deleting the event.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
