import { AuthService } from './auth.service';
import { Auth } from './auth.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        username: string;
        password: string;
    }): Promise<Auth>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        accessToken: string;
    } | null>;
}
