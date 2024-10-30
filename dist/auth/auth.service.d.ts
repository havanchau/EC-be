import { Model } from 'mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private authModel;
    private jwtService;
    constructor(authModel: Model<AuthDocument>, jwtService: JwtService);
    register(username: string, password: string): Promise<Auth>;
    login(username: string, password: string): Promise<{
        accessToken: string;
    } | null>;
}
