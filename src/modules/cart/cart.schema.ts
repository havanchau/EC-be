import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../../interface/item';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({ type: String, description: 'User ID', required: true })
  @Prop({ type: String })
  userId: string;

  @ApiProperty({
    type: [Item],
    description: 'List of items in the cart',
  })
  @Prop([
    {
      productId: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: Item[];

}

export const CartSchema = SchemaFactory.createForClass(Cart);
