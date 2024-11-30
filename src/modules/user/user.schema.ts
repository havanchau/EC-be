import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SALER = 'saler',
}

@Schema()
export class User {
  @ApiProperty({ description: 'The username of the user', example: 'john_doe', maxLength: 100 })
  @Prop({ required: true, length: 100 })
  username: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123', maxLength: 255 })
  @Prop({ required: true, length: 255 })
  password: string;

  @ApiProperty({ description: 'The name of the user', example: 'John Doe', maxLength: 100, nullable: true })
  @Prop({ length: 100, nullable: true })
  name: string;

  @ApiProperty({ description: 'The phone number of the user', example: '1234567890', maxLength: 10, nullable: true })
  @Prop({ length: 10, nullable: true })
  phone: string;

  @ApiProperty({ description: 'The email of the user', example: 'johndoe@example.com', maxLength: 150, nullable: true })
  @Prop({ length: 150, nullable: true })
  email: string;

  @ApiProperty({ description: 'Indicates whether the user is deleted', example: false, default: false })
  @Prop({ default: false })
  isDel: boolean;

  @ApiProperty({ description: 'Check user verify', example: false, default: false })
  @Prop({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'The refresh token for user session management', example: 'some_refresh_token', nullable: true })
  @Prop({ nullable: true })
  refreshToken: string;

  @ApiProperty({ description: 'The date when the user was created', example: '2024-10-31T08:00:00.000Z', default: Date.now })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the user was last updated', example: '2024-10-31T08:00:00.000Z', default: Date.now })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @ApiProperty({
    description: 'The role of the user',
    example: UserRole.CUSTOMER,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
