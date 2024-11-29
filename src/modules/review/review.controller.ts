import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { Review } from './review.schema';
import { CurrentUser } from 'src/decorators/userdata.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiBody({ type: Review })
  async createReview(@Body() reviewData: Partial<Review>): Promise<Review> {
    try {
      return this.reviewService.createReview(reviewData);
    }
    catch (err) {
      return err.message;
    }
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiParam({ name: 'productId', required: true })
  async getReviewsByProduct(@Param('productId') productId: string): Promise<Review[]> {
    return this.reviewService.getReviewsByProduct(productId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  async updateReview(@CurrentUser() user: any, @Param('id') id: string, @Body() reviewData: Partial<Review>): Promise<Review> {
    return this.reviewService.updateReview(id, reviewData, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  async deleteReview(@Param('id') id: string): Promise<void> {
    return this.reviewService.deleteReview(id);
  }
}
