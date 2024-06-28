import { IsString } from 'class-validator';

export class ClientDto {
  @IsString()
  name: string;

  @IsString()
  bio: string;

  @IsString()
  clientId: string;
}

export class ClientImageDto {
  @IsString()
  image: string;

  @IsString()
  clientId: string;
}
