import { Controller, Get, Post, Body, Param, Patch, Delete, UploadedFiles, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: Product })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @ApiResponse({ status: 201, description: 'Product created successfully.', type: Product })
  async create(@Body() productData: Partial<Product>, @UploadedFiles() files: { images?: Express.Multer.File[] }): Promise<Product> {
    const images = Array.isArray(files.images) ? files.images : [files.images];
    return this.productService.create(productData, images);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products.', type: [Product] })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: Product })
  @ApiResponse({ status: 200, description: 'Product updated successfully.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async update(@Param('id') id: string, @Body() productData: Partial<Product>): Promise<Product> {
    return this.productService.update(id, productData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
