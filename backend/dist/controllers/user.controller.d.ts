import { Request } from 'express';
import { AuthService } from '../auth/shared/auth.service';
import { UserBody } from '../dtos/user-body';
import { UserRepository } from '../repositories/user-repository';
export declare class UserController {
    private userRepository;
    private authService;
    constructor(userRepository: UserRepository, authService: AuthService);
    create(body: UserBody): Promise<void>;
    validate(request: any): Promise<{
        access_token: string;
    }>;
    hasToken(): void;
    isAdmin(): Promise<boolean>;
    getAllAdminNicknames(): Promise<string[]>;
    removeAdmin(request: Request): Promise<{
        nickname: string;
    }>;
    addAdmin(request: Request): Promise<{
        nickname: string;
    }>;
}
