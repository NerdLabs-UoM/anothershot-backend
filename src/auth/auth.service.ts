import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/auth.dto";
import { UserService } from "src/user/user.service";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);
        
        const payload = {
            email: user.email,
            id: user.id,
        };

        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload,{
                    expiresIn: '20s',
                    secret: process.env.jwtSecretKey,
                }),
                refreshToken: await this.jwtService.signAsync(payload,{
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshTokenKey,
                }),
            }
        };
    }

    async validateUser(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (user && (await compare(dto.password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Incorrect email or password');
    }

    async refreshToken(user: any) {
        const payload = {
            email: user.email,
            id: user.id,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload,{
                expiresIn: '7d',
                secret: process.env.jwtSecretKey,
            }),
            refreshToken: await this.jwtService.signAsync(payload,{
                expiresIn: '7d',
                secret: process.env.jwtRefreshTokenKey,
            }),
        };
    }
}