import { Module } from "@nestjs/common";
import { PhotographerService } from "./photographer.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PhotographerController } from './photographer.controller';
import { JwtService } from "@nestjs/jwt";
import { NotifyService } from "src/notification/notify.service";
import { AppGateway } from "src/app.gateway";
import { AlbumsModule } from './albums/albums.module';
import { SettingsModule } from "./settings/settings.module";

@Module({
    controllers: [PhotographerController],
    providers: [PhotographerService, PrismaService, JwtService,NotifyService,AppGateway],
    imports: [AlbumsModule,SettingsModule],
})

export class PhotographerModule { }
