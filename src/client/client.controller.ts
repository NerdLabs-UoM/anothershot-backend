import { Controller, Get, Patch } from '@nestjs/common';
import { ClientService } from './client.service';
import { Body, Param } from '@nestjs/common';
@Controller('api/client')
export class ClientController {
    constructor(private clientService: ClientService) { }

   
}
