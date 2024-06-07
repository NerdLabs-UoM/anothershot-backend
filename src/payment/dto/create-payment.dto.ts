import { IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    title: string;

    @IsString()
    amount: number;

    @IsString()
    currency: string;
    automatic_payment_methods: {
        enabled: boolean;
    };
    clientSecret: string;
    calculateOrderAmount: (items: CreatePaymentDto) => number;
    create: (createPaymentDto: CreatePaymentDto) => string;
    findAll: () => string;
    findOne: (id: number) => string;
    remove: (id: number) => string;
}

export class AlbumPayment{
    @IsString()
    clientId: string;

    @IsString()
    photographerId: string;

    @IsString()
    albumId: string;

    @IsString()
    amount: number;

    @IsString()
    currency: string;
}