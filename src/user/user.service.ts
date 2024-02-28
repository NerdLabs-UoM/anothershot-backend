import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/user.dto";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (user) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await hash(dto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                userName: dto.userName,
                password: hashedPassword,
                userRole: dto.userRole,
            }
        });

        switch (newUser.userRole) {
            case UserRole.ADMIN:
                return await this.prisma.admin.create({
                    data: {
                        userId: newUser.id,
                        name: newUser.userName
                    }
                });
            case UserRole.CLIENT:
                return await this.prisma.client.create({
                    data: {
                        userId: newUser.id,
                        name: newUser.userName
                    }
                });
            case UserRole.PHOTOGRAPHER:
                return await this.prisma.photographer.create({
                    data: {
                        userId: newUser.id,
                        name: newUser.userName
                    }
                });
            default:
                return newUser;
        }
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                admin: true,
                client: true,
                photographer: true,
                chats: true
            }
        });
    }
}
