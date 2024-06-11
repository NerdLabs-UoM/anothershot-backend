import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from 'src/app.gateway';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService,PrismaService,JwtService,AppGateway]
})
export class AlbumsModule {}
