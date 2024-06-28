import { UserRole } from '@prisma/client';

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
}
