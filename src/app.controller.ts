// AppController

import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
    this.logger.log('AppController initialized');
  }

  @Get()
  getHello(): string {
    this.logger.log('getHello endpoint called');
    return this.appService.getHello();
  }
}
