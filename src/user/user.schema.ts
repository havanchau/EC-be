import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, length: 100 })
  username: string;

  @Prop({ required: true, length: 255 })
  password: string;

  @Prop({ length: 100, nullable: true })
  name: string;

  @Prop({ length: 10, nullable: true })
  phone: string;

  @Prop({ length: 150, nullable: true })
  email: string;

  @Prop({ default: false })
  isDel: boolean;

  @Prop({ nullable: true })
  refreshToken: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
