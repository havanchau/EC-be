import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {

  @Prop({ required: true, length: 255 })
  imageUrl: string;

  @Prop({ length: 100, nullable: true })
  productId: string;

  @Prop({ length: 10, nullable: true })
  userId: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
