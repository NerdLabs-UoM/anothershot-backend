import { Module } from "@nestjs/common";
import { PhotographerService } from "./photographer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PhotographerController } from './photographer.controller';
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [PhotographerController],
    providers: [PhotographerService, PrismaService, JwtService],
})

export class PhotographerModule { }
