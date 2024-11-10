import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ])
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
    required: true,
  })
  paymentMethod: string;

  @Prop({ required: true })
  totalAmount: number;

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

  @Prop({ default: Date.now })
  orderDate: Date;

  @Prop()
  deliveryDate?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
