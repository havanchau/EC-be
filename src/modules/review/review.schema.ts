import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @ApiProperty()
  @Prop({ type: String, required: true })
  userId: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  productId: string;

  @ApiProperty({ description: 'Review rating between 1 and 5' })
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @ApiProperty()
  @Prop({ type: String, required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
