import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ImageModule } from './cloudinary/image.module';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    AuthModule,
    UserModule,
    ProductModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'CLOUDINARY',
      useValue: cloudinary,
    },
  ],
  exports: ['CLOUDINARY'],
})
export class AppModule {}
