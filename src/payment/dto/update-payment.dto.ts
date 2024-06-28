import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdatePaymentStatusDto extends PartialType(CreatePaymentDto) {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
