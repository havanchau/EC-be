import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async createReview(reviewData: Partial<Review>): Promise<Review> {
    const review = new this.reviewModel(reviewData);
    return review.save();
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviewModel.find({ productId }).exec();
  }

  async updateReview(id: string, reviewData: Partial<Review>): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(id, reviewData, { new: true });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async deleteReview(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Review not found');
  }
}