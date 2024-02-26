import { UserRole,PhotographerCategory } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class UpdatePhotographerDto {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  password: string;
  userRole: UserRole;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  category: PhotographerCategory;
}
