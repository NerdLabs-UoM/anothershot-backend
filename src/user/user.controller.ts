import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('api/user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get(":id")
    async getUser(@Param("id") id: string) {
        return await this.userService.findById(id);
    }

}
