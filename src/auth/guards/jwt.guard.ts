import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

// JwtGuard
@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(private jwtService: JwtService) {}

  // Method to check if the request has a valid JWT token
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.error('No token found in the request headers');
      throw new UnauthorizedException('No token found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.jwtSecretKey,
      });

      request['user'] = payload;
      this.logger.log('Token verification successful');
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Token verification failed');
    }
    return true;
  }

  // Method to extract token from the Authorization header
  private extractTokenFromHeader(request: Request) {
    if (!request.headers.authorization) {
      this.logger.warn('Authorization header is missing');
      return undefined;
    }
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
