import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { sendEmail } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { username: { $eq: createUserDto.username } },
          { email: { $eq: createUserDto.email } },
        ],
      });


    if (existingUser) {
      throw new HttpException(
        'User with this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const user = savedUser.toObject();
    const { password, ...res } = user;

    const token = this.generateToken(user._id as string);

    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
    await sendEmail(
      createUserDto.email,
      'Verify your email',
      `Click the link to verify your email: ${verificationUrl}`,
    );

    return res;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; user: any } | null> {
    const user = await this.userModel
      .findOne({
        username: loginUserDto.username,
        isVerified: true,
      })
      .exec();
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new HttpException(
          'JWT_SECRET is not defined in the environment variables',
          HttpStatus.BAD_REQUEST,
        );
      }

      const accessToken = this.jwtService.sign(
        {
          username: user.username,
          sub: user._id,
        },
        { secret: jwtSecret },
      );
      const { password, ...res } = user.toObject();
      return { user: res, accessToken };
    }
    throw new HttpException(
      'Invalid information or User not verified',
      HttpStatus.BAD_REQUEST,
    );
  }

  async find(username: string): Promise<User | null> {
    return this.userModel
      .findOne({ username, isVerified: true })
      .select('-password')
      .exec();
  }

  async gets(): Promise<User[] | null> {
    return this.userModel.find({ isVerified: true }).select('-password').exec();
  }

  private generateToken(userId: string): string {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '30d' };
    return this.jwtService.sign(payload, { ...options, secret });
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new HttpException(
          'JWT_SECRET is not defined in the environment variables',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload = this.jwtService.verify(token, { secret: jwtSecret });
      const userId = payload.userId;

      const user = await this.userModel.findOne({
        _id: userId,
        isVerified: false,
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      if (user.isVerified) {
        return { message: 'User is already verified' };
      }

      user.isVerified = true;
      await user.save();

      return { message: 'User verified successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
