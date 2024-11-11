import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '15d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule {}
