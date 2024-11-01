import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageModule } from './cloudinary/image.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey1234567890',
      signOptions: { expiresIn: '30d' },
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    AuthModule,
    UserModule,
    ProductModule,
    ImageModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
