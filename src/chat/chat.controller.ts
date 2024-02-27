import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ChatCreateDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { MessageSendDto } from './dto/message.dto';

@Controller('api/chat')
export class ChatController {

    constructor(
        private chatService: ChatService
    ) { }

    @Post('create')
    async create(
        @Body() dto: ChatCreateDto
    ) {
        return await this.chatService.create(dto);
    }

    @Get(':id')
    async getChatsByUserId(
        @Param('id') id: string
    ) {
        return await this.chatService.getChatsByUserId(id);
    }

    @Get('/selected/:chatId')
    async getChatsByChatId(
        @Param('chatId') chatId: string
    ) {
        return await this.chatService.getChatsByChatId(chatId);
    }

    @Post('message/send')
    async sendMessage(
        @Body() dto: MessageSendDto
    ) {
        return await this.chatService.sendMessage(dto);
    }
}
