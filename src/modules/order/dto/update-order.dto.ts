import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ShippingAddressDto {
  @ApiProperty({ description: 'Street name', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State', example: 'NY' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Zip Code', example: '10001' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

class ItemDto {
  @ApiProperty({ description: 'Product ID', example: '12345' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Price per item', example: 29.99 })
  @IsNotEmpty()
  price: number;
}

export class UpdateOrderDto {
  @ApiProperty({
    type: [ItemDto],
    description: 'List of items in the order',
    example: [
      {
        productId: '12345',
        quantity: 2,
        price: 29.99,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ApiProperty({
    description: 'Payment method',
    example: 'Credit Card',
  })
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    description: 'Shipping address',
    type: ShippingAddressDto,
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({
    description: 'Delivery date',
    example: '2024-11-28T01:35:02.85Z',
  })
  @IsDateString()
  deliveryDate: string;
}
