import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { ImageService } from 'src/modules/cloudinary/image.service';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/review.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly imageService: ImageService,
    private readonly reviewService: ReviewService,
  ) {}

  async create(
    productData: Partial<Product>,
    images: Express.Multer.File[],
  ): Promise<Product> {
    productData.images = [];
    for (const file of images) {
      const result = await this.imageService.uploadImage(file);
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
    productIds?: string[];
    page?: number;
    pageSize?: number;
  }): Promise<any> {
    const { name, category, minPrice, maxPrice, brand, rating, desc, benefit, productIds, page = 1, pageSize = 20 } = query;

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

    if (productIds) {
      filter.productId = { $in: productIds };
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const results = await this.productModel.find(filter).skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await this.productModel.countDocuments(filter).exec();

    return {
      results,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  }

  async findOne(id: string): Promise<{ product: Product; feedbacks: Review[] }> {
    const product = await this.productModel.findById(id).exec();
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    const feedbacks = await this.reviewService.getReviewsByProduct(id);
  
    return { product, feedbacks };
  }
  

  async update(
    id: string,
    productData: Partial<Product>,
    imagesUpdate: Express.Multer.File[] | null = null,
  ): Promise<Product> {
    const newImages = [];

    if (imagesUpdate) {
      for (const file of imagesUpdate) {
        const result = await this.imageService.uploadImage(file);
        newImages.push(result.secure_url);
      }
    }

    if (productData.images) {
      const oldProductData = (await this.findOne(id)).product;
    
      productData.images = [...oldProductData.images, ...newImages];
    }
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, productData, { new: true })
      .exec();
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
