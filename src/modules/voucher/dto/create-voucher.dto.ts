import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreateVoucherDto {
  @ApiProperty({
    description: 'Voucher Code',
    example: 'DISCOUNT50',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Maximum usage of the voucher',
    example: 100,
    required: true,
  })
  @IsNumber()
  @Min(1)
  maxUsage: number;

  @ApiProperty({
    description: 'Discount percentage of the voucher (0 - 100)',
    example: 20,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @ApiProperty({
    description: 'Maximum discount price (absolute value)',
    example: 50000,
    required: true,
  })
  @IsNumber()
  @Min(0)
  maxDiscountPrice: number;

  @ApiProperty({
    description: 'Is the voucher active?',
    example: true,
    required: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Expiry date of the voucher (ISO format, optional)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}
