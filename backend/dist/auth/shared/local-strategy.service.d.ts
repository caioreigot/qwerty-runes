import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
declare const LocalStrategyService_base: new (...args: any[]) => Strategy;
export declare class LocalStrategyService extends LocalStrategyService_base {
    private authService;
    constructor(authService: AuthService);
    validate(request: Request, nickname: string, password: string): Promise<{
        id: number;
        nickname: string;
    }>;
}
export {};
