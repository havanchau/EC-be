import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from './image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]), // Adjust if you're using TypeORM
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
