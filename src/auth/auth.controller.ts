import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';

// AuthController
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  // Register a new user
  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    this.logger.log(`Registering user with email: ${dto.email}`);
    try {
      return await this.userService.create(dto);
    } catch (error) {
      this.logger.error(
        `User registration failed: ${error.message}`,
        error.stack
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Login a user
  @Post('login')
  async loginUser(@Body() dto: LoginDto) {
    this.logger.log(`Logging in user with email: ${dto.email}`);
    try {
      return await this.authService.login(dto);
    } catch (error) {
      this.logger.error(`User login failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // Refresh token
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    this.logger.log(`Refreshing token for user: ${req.user.email}`);
    try {
      return await this.authService.refreshToken(req.user);
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // Create a token for a user
  @Post('token/:userId')
  async token(@Param('userId') userId: string, @Body() data: any) {
    this.logger.log(`Creating token for user with ID: ${userId}`);
    try {
      return await this.authService.createToken(userId, data);
    } catch (error) {
      this.logger.error(`Token creation failed: ${error.message}`, error.stack);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
