import { Body, Controller, Get, Param,Patch } from "@nestjs/common";
import { NotifyService } from './notify.service';
import { UpdateNotifyDto } from "./dto/create-notify.dto";

@Controller('api/notification')
export class NotifyController {
    constructor(private NotifyService:NotifyService){}

    @Get(':id')
    async getNotifications(@Param('id') userId:string){
        return await this.NotifyService.getNotifications(userId);
    }

    @Patch('/update')
  async updateNotify(@Body() dto: UpdateNotifyDto) {
    return await this.NotifyService.updateNotify(dto);
  }
    
}