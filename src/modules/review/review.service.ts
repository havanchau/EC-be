import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async createReview(reviewData: Partial<Review>): Promise<Review> {
    const product = this.productService.findOne(reviewData.productId);

    if (!product) {
      throw new Error('Product with productId not exist!');
    }

    const review = new this.reviewModel(reviewData);
    return review.save();
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviewModel.find({ productId }).exec();
  }

  async updateReview(
    id: string,
    reviewData: Partial<Review>,
    userId: string,
  ): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      { _id: id, userId },
      reviewData,
      {
        new: true,
      },
    );
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async deleteReview(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Review not found');
  }
}
