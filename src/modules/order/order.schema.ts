import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../../interface/item';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ type: String, description: 'User ID', required: true })
  @Prop({ type: String })
  userId: string;

  @ApiProperty({
    type: [Item],
    description: 'List of items in the order',
  })
  @Prop([
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ])
  items: Item[];

  @ApiProperty({
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    description: 'Current status of the order',
  })
  @Prop({
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  })
  status: string;

  @ApiProperty({
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    description: 'Current status of the order',
  })
  @Prop({
    type: String,
    enum: ['Pending', 'Paied', 'Cancelled'],
    default: 'Pending',
  })
  paymentStatus: string;

  @Prop({
    type: String,
    default: null,
  })
  paymentInfo: string;

  @ApiProperty({
    type: String,
    enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
    description: 'Payment method for the order',
  })
  @Prop({
    type: String,
    enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
    required: true,
  })
  paymentMethod: string;

  @ApiProperty({
    type: Number,
    description: 'Total amount of the order',
    required: true,
  })
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty({
    description: 'Shipping address of the order',
    type: () => ({
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    }),
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
