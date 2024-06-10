import { Module } from "@nestjs/common";
import { PhotographerService } from "./photographer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PhotographerController } from './photographer.controller';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";
import { PackagesModule } from './packages/packages.module';
import { ContactSectionModule } from './contact-section/contact-section.module';

@Module({
    controllers: [PhotographerController],
    providers: [PhotographerService, PrismaService, JwtService,NotifyService,AppGateway],
    imports: [PackagesModule, ContactSectionModule],
   
})

export class PhotographerModule { }
