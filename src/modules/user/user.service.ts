import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    const savedUser = await newUser.save();
    
    const user = savedUser.toObject();
    delete user.password;

    const token = this.generateToken(user._id as string);

    return { user, token };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string, user: User } | null> {
    const user = await this.userModel.findOne({ username: loginUserDto.username });
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      const accessToken = this.jwtService.sign({
        username: user.username,
        sub: user._id,
      });
      return { user, accessToken };
    }
    return null;
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }
}
