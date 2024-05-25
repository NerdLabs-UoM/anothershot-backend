import { Body, Controller, Get, Param, Patch, Delete,Post } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { UpdateNotifyDto,CreateNotifyDto } from './dto/create-notify.dto';

@Controller('api/notification')
export class NotifyController {
  constructor(private NotifyService: NotifyService) {}

  @Get(':id')
  async getNotifications(@Param('id') userId: string) {
    return await this.NotifyService.getNotifications(userId);
  }

  @Patch('/update')
  async updateNotify(@Body() dto: UpdateNotifyDto) {
    return await this.NotifyService.updateNotify(dto);
  }

  @Delete('/delete/:notifyId/:userId')
  async deleteNotify(
    @Param('notifyId') notifyId: string,
    @Param('userId') userId: string,
  ) {
    return await this.NotifyService.deleteNotify(notifyId, userId);
  }

  @Post('create')
  async createNotification(@Body() dto: CreateNotifyDto) {
    return await this.NotifyService.createNotification(dto);
  }
}
