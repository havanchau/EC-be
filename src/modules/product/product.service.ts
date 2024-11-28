import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { ImageService } from 'src/modules/cloudinary/image.service';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>, private imageService: ImageService) {}

  async create(productData: Partial<Product>, images: Express.Multer.File[]): Promise<Product> {
    productData.images = [];
    for (const file of images) {
      const result = await this.imageService.uploadImage(file)
      productData.images.push(result.secure_url);
    }

    const product = new this.productModel(productData);
    const savedProduct = await product.save();

    return savedProduct;
  }

  async findAll(query: { 
    name?: string; 
    category?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    brand?: string; 
    rating?: number;
    desc?: string;
    benefit?: string;
  }): Promise<Product[]> {
    const { name, category, minPrice, maxPrice, brand, rating, desc, benefit } = query;
  
    const filter: any = {};
  
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }
    if (brand) {
      filter.brand = brand;
    }
    if (rating !== undefined) {
      filter.rating = { $gte: rating };
    }

    if (desc) {
      filter.desc = { $regex: desc, $options: 'i' };
    }

    if (benefit) {
      filter.benefit = { $regex: benefit, $options: 'i' };
    }
  
    return await this.productModel.find(filter);
  }
  

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, productData: Partial<Product>, images: Express.Multer.File[]): Promise<Product> {
    const newImages = [];
    for (const file of images) {
      const result = await this.imageService.uploadImage(file)
      newImages.push(result.secure_url);
    }
    productData.images = [...productData.images, ...newImages];
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, productData, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }
}
