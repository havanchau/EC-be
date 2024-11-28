import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VoucherDocument = Voucher & Document;

@Schema({ timestamps: true })
export class Voucher {
  @ApiProperty({ type: String, description: 'Voucher Code', required: true })
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @ApiProperty({
    type: Number,
    description: 'Maximum usage of the voucher',
    required: true,
  })
  @Prop({ type: Number, required: true })
  maxUsage: number;

  @ApiProperty({
    type: Number,
    description: 'Discount of voucher',
    required: true,
  })
  @Prop({ type: Number, required: true })
  discount: number;

  @ApiProperty({
    type: Number,
    description: 'Max discount of voucher',
    required: true,
  })
  @Prop({ type: Number, required: true })
  maxDiscountPrice: number;

  @ApiProperty({
    type: Number,
    description: 'Current usage of the voucher',
    required: false,
    default: 0,
  })
  @Prop({ type: Number, default: 0 })
  currentUsage: number;

  @ApiProperty({
    type: Boolean,
    description: 'Is the voucher active?',
    required: true,
    default: true,
  })
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @ApiProperty({
    type: String,
    description: 'Expiry date of the voucher (ISO format)',
    required: false,
  })
  @Prop({ type: Date })
  expiresAt?: Date;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
