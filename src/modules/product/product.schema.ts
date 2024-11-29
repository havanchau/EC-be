import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({ description: 'The name of the product', example: 'Eco-friendly Shampoo' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ description: 'The price of the product', example: 25.99 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'The original price of the product', example: 25.99 })
  @Prop({ required: true })
  originalPrice: number;

  @ApiProperty({ description: 'A description of the product', example: 'Organic shampoo with natural ingredients' })
  @Prop()
  desc: string;

  @ApiProperty({ description: 'The category of the product', example: 'Shampoo' })
  @Prop({ required: true })
  category: string;

  @ApiProperty({ description: 'Stock quantity of the product', example: 100 })
  @Prop({ required: true })
  stock: number;

  @ApiProperty({ description: 'Brand of the product', example: 'EcoBeauty' })
  @Prop()
  brand: string;

  @ApiProperty({ description: 'Benefits of the product', example: 'Moisturizes hair and scalp' })
  @Prop()
  benefit: string;

  @ApiProperty({ description: 'Capacity of the product container', example: '250ml' })
  @Prop()
  capacity: string;

  @ApiProperty({ description: 'Average rating of the product', example: 4.5, default: 0 })
  @Prop({ default: 0 })
  rating: number;

  @ApiProperty({ description: 'Whether the product is deleted or not', example: false, default: false })
  @Prop({ default: false })
  isDel: boolean;

  @ApiProperty({ description: 'URLs of images for the product', example: ['http://example.com/image1.jpg'] })
  @Prop()
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
