import { Body, Controller, Delete, Get, Param, Post, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ChatCreateDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { MessageSendDto } from './dto/message.dto';

// ChatController
@Controller('api/chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(
        private chatService: ChatService
    ) { }

    // Create a new chat
    @Post('create')
    async create(
        @Body() dto: ChatCreateDto
    ) {
        this.logger.log(`Creating chat between ${dto.senderId} and ${dto.receiverId}`);
        try {
            return await this.chatService.create(dto);
        } catch (error) {
            this.logger.error(`Chat creation failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Get chats by user ID
    @Get(':id')
    async getChatsByUserId(
        @Param('id') id: string
    ) {
        this.logger.log(`Fetching chats for user ID: ${id}`);
        try {
            return await this.chatService.getChatsByUserId(id);
        } catch (error) {
            this.logger.error(`Fetching chats failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    // Get chat by chat ID
    @Get('/selected/:chatId')
    async getChatsByChatId(
        @Param('chatId') chatId: string
    ) {
        this.logger.log(`Fetching chat with ID: ${chatId}`);
        try {
            return await this.chatService.getChatsByChatId(chatId);
        } catch (error) {
            this.logger.error(`Fetching chat failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    // Send a message
    @Post('message/send')
    async sendMessage(
        @Body() dto: MessageSendDto
    ) {
        this.logger.log(`Sending message from ${dto.senderId} to ${dto.receiverId}`);
        try {
            return await this.chatService.sendMessage(dto);
        } catch (error) {
            this.logger.error(`Sending message failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a chat
    @Delete('delete/:userId/:chatId')
    async deleteChat(
        @Param('userId') userId: string,
        @Param('chatId') chatId: string
    ) {
        this.logger.log(`Deleting chat with ID: ${chatId} for user ID: ${userId}`);
        try {
            return await this.chatService.deleteChat(userId, chatId);
        } catch (error) {
            this.logger.error(`Deleting chat failed: ${error.message}`, error.stack);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
