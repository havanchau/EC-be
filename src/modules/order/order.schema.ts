import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../enum/index';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ type: String, description: 'User ID', required: true })
  @Prop({ type: String })
  userId: string;

  @ApiProperty({
    type: Array,
    description: 'List of items in the order',
  })
  @Prop([
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ])
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;

  @ApiProperty({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    description: 'Current status of the order',
  })
  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    description: 'Payment status of the order',
  })
  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    type: String,
    default: null,
  })
  paymentInfo: string;

  @ApiProperty({
    type: String,
    enum: PaymentMethod,
    description: 'Payment method for the order',
  })
  @Prop({
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    type: Number,
    description: 'Total amount of the order',
    required: true,
  })
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty({
    description: 'Shipping address of the order',
    type: () => ({}),
  })
  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiProperty({ type: Date, description: 'Order date' })
  @Prop({ default: Date.now })
  orderDate: Date;

  @ApiProperty({ type: Date, description: 'Delivery date', required: false })
  @Prop()
  deliveryDate?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
