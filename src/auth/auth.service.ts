import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string): Promise<{ user: Auth; token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.authModel({ username, password: hashedPassword });
    const savedUser = await newUser.save();
    
    const user = savedUser.toObject();
    delete user.password;
    
    // Generate JWT token
    const token: string = this.generateToken(user._id as string);

    return { user, token };
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string } | null> {
    const user = await this.authModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = this.jwtService.sign({
        username: user.username,
        sub: user._id,
      });
      return { accessToken };
    }
    return null;
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}
