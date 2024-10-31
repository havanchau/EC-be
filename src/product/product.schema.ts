import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { Feedback } from '../feedback/feedback.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  desc: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  stock: number;

  @Prop()
  brand: string;

  @Prop()
  benefit: string;

  @Prop()
  capacity: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: false })
  isDel: boolean;

//   @Prop({ type: [Feedback] })
//   feedbacks: Feedback[];

  @Prop()
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
