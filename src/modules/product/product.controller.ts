import { Role } from './../../decorators/roles.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PartialType } from '@nestjs/mapped-types';
import { Public } from '../../decorators/public.decorator';
import { Review } from '../review/review.schema';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Role('admin', 'saler')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ description: 'Data for creating a new product', type: Product })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    type: Product,
  })
  async create(
    @Body() productData: Partial<Product>,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<Product> {
    const images = Array.isArray(files.images) ? files.images : [files.images];
    return this.productService.create(productData, images);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products.',
    type: [Product],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by product name',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by product category',
  })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({
    name: 'brand',
    required: false,
    description: 'Filter by product brand',
  })
  @ApiQuery({ name: 'rating', required: false, description: 'Minimum rating' })
  @ApiQuery({ name: 'desc', required: false, description: 'Desc of product' })
  @ApiQuery({
    name: 'benefit',
    required: false,
    description: 'Benefit of product',
  })
  async findAll(
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('brand') brand?: string,
    @Query('rating') rating?: number,
    @Query('desc') desc?: string,
    @Query('benefit') benefit?: string,
  ): Promise<Product[]> {
    return this.productService.findAll({
      name,
      category,
      minPrice,
      maxPrice,
      brand,
      rating,
      desc,
      benefit,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(
    @Param('id') id: string,
  ): Promise<{ product: Product; feedbacks: Review[] }> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Role('admin', 'saler')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({
    description: 'Updated data for the product',
    type: PartialType(Product),
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<Product> {
    const images = Array.isArray(files.images) ? files.images : [files.images];
    return this.productService.update(id, productData, images);
  }

  @Delete(':id')
  @Role('admin')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
