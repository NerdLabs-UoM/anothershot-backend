import { Injectable, UnauthorizedException, Logger, BadRequestException } from "@nestjs/common";
import { LoginDto } from "./dto/auth.dto";
import { UserService } from "src/user/user.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

// AuthService
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    // Login a user and return tokens
    async login(dto: LoginDto) {
        this.logger.log(`Authenticating user with email: ${dto.email}`);
        const user = await this.validateUser(dto);

        if (!user) {
            this.logger.error('Authentication failed: Incorrect email or password');
            throw new UnauthorizedException('Incorrect email or password');
        }

        const payload = { email: user.email, sub: user.id };

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '20s',
                secret: process.env.jwtSecretKey,
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: process.env.jwtRefreshTokenKey,
            }),
            expiresIn: new Date().setTime(new Date().getTime() + 20000),
        };
    }

    // Validate user credentials
    async validateUser(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user) {
            this.logger.error('Validation failed: User not found');
            throw new UnauthorizedException('Incorrect email or password');
        }

        const isPasswordValid = await compare(dto.password, user.password);

        if (!isPasswordValid) {
            this.logger.error('Validation failed: Incorrect password');
            throw new UnauthorizedException('Incorrect email or password');
        }

        const { password, ...result } = user;
        return result;
    }

    // Refresh tokens
    async refreshToken(user: any) {
        this.logger.log(`Refreshing token for user with email: ${user.email}`);
        const payload = { email: user.email, id: user.id };

        try {
            return {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '20s',
                    secret: process.env.jwtSecretKey,
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey,
                }),
                expiresIn: new Date().setTime(new Date().getTime() + 20000),
            };
        } catch (error) {
            this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
            throw new BadRequestException('Token refresh failed');
        }
    }

    // Create a token for a user
    async createToken(userId: string, data: any) {
        this.logger.log(`Creating token for user ID: ${userId}`);
        const payload = { email: data.email, id: userId };

        try {
            return {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '20s',
                    secret: process.env.jwtSecretKey,
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey,
                }),
                expiresIn: new Date().setTime(new Date().getTime() + 20000),
            };
        } catch (error) {
            this.logger.error(`Token creation failed: ${error.message}`, error.stack);
            throw new BadRequestException('Token creation failed');
        }
    }
}
