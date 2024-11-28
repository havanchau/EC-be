import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { relative } from 'node:path/posix';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const existingUser = await this.userModel
      .findOne({
        $or: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      })
      .select('_id');
    if (existingUser) {
      return null;
    }
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const user = savedUser.toObject();
    delete user.password;

    const token = this.generateToken(user._id as string);

    return { user, token };
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; user: any } | null> {
    const user = await this.userModel.findOne({
      username: loginUserDto.username,
    }).exec();
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error(
          'JWT_SECRET is not defined in the environment variables',
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
    return null;
  }

  async find(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).select('-password').exec();
  }

  async gets(): Promise<User[] | null> {
    return this.userModel.find().select('-password').exec();
  }

  private generateToken(userId: string): string {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };
    return this.jwtService.sign(payload, { ...options, secret });
  }
}
