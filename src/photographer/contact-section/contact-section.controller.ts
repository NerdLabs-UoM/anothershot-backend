import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ContactSectionService } from './contact-section.service';
import { contactDetailsDto } from './dto/contactDetails.dto';

@Controller('api/photographer')
export class ContactSectionController {
  private readonly logger = new Logger(ContactSectionController.name);
  constructor(private readonly contactSectionService: ContactSectionService) {}

  @Put('contactdetails')
  async updateContactDetails(@Body() dto: contactDetailsDto) {
    try {
      this.logger.log(`Updating contact details for user ID: ${dto.userId}`);
      const updatedDetails =
        await this.contactSectionService.updateContactDetails(dto);
      this.logger.log(
        `Contact details updated successfully for user ID: ${dto.userId}`
      );
      return updatedDetails;
    } catch (error) {
      this.logger.error(
        `Error updating contact details for user ID: ${dto.userId}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the contact details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('contactdetails/:id')
  async getContactDetails(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching contact details for user ID: ${id}`);
      const contactDetails =
        await this.contactSectionService.getContactDetails(id);
      if (!contactDetails) {
        this.logger.warn(`No contact details found for user ID: ${id}`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Contact details not found.',
          },
          HttpStatus.NOT_FOUND
        );
      }
      this.logger.log(
        `Contact details fetched successfully for user ID: ${id}`
      );
      return contactDetails;
    } catch (error) {
      this.logger.error(
        `Error fetching contact details for user ID: ${id}`,
        error.message
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem fetching the contact details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
