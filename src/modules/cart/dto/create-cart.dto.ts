import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @ApiProperty({ description: 'Product ID', example: '12345' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Price per item', example: 29.99 })
  @IsNotEmpty()
  price: number;
}

export class CreateCartDto {
  @ApiProperty({
    type: [ItemDto],
    description: 'List of items in the order',
    example: [
      {
        productId: '12345',
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
