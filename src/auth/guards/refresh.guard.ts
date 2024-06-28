import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

// RefreshJwtGuard
@Injectable()
export class RefreshJwtGuard implements CanActivate {
  private readonly logger = new Logger(RefreshJwtGuard.name);

  constructor(private jwtService: JwtService) {}

  // Method to check if the request has a valid refresh JWT token
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.error('No refresh token found in the request headers');
      throw new UnauthorizedException('No refresh token found');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.jwtRefreshTokenKey,
      });

      request['user'] = payload;
      this.logger.log('Refresh token verification successful');
    } catch (error) {
      this.logger.error(`Refresh token verification failed: ${error.message}`);
      throw new UnauthorizedException('Refresh token verification failed');
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
    return type === 'Refresh' ? token : undefined;
  }
}
