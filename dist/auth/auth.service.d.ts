import { Model } from 'mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private authModel;
    private jwtService;
    constructor(authModel: Model<AuthDocument>, jwtService: JwtService);
    register(username: string, password: string): Promise<{
        user: Auth;
        token: string;
    }>;
    login(username: string, password: string): Promise<{
        accessToken: string;
    } | null>;
    private generateToken;
}
