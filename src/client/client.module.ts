import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

// ClientModule
@Module({
  controllers: [ClientController],
  providers: [ClientService,PrismaService,JwtService]
})
export class ClientModule{}