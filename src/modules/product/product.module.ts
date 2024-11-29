import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ImageService } from 'src/modules/cloudinary/image.service';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
    forwardRef(() => ReviewModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ImageService],
  exports: [ProductService],
})
export class ProductModule {}
