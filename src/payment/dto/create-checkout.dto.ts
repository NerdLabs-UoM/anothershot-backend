import { IsString } from "class-validator";

export class CkeckoutDto{
    @IsString()
    bookingId: string;

    @IsString()
    name: string;

    @IsString()
    price: number;

    @IsString()
    currency: string;

    @IsString()
    clientId: string;
}