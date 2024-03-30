import { Body, Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/user.dto";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { RefreshJwtGuard } from "./guards/refresh.guard";

@Controller('api/auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }

    @Post('register')
    async registerUser(@Body() dto: CreateUserDto) {
        return await this.userService.create(dto);
    }

    @Post('login')
    async loginUser(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        return await this.authService.refreshToken(req.user);
    }

    @Post('token/:userId')
    async token(
        @Param('userId') userId: string,
        @Body() data: any) {
        return await this.authService.createToken(userId, data);
    }
}