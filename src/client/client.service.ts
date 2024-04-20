import { Injectable } from '@nestjs/common';
import { Photographer, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';



@Injectable()
export class ClientService {
    private prisma: PrismaClient;

    constructor() {
      this.prisma = new PrismaClient();

    }
    
}
