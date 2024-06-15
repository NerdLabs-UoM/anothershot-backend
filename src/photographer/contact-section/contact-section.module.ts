import { Module } from '@nestjs/common';
import { ContactSectionService } from './contact-section.service';
import { ContactSectionController } from './contact-section.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";

@Module({
  controllers: [ContactSectionController],
  providers: [ContactSectionService , PrismaService, JwtService,NotifyService,AppGateway
    
  ],
})
export class ContactSectionModule {}
