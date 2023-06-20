import { Request, Response } from 'express';
import { AuthService } from '../auth/shared/auth.service';
import { UserBody } from '../dtos/user-body';
import { UserRepository } from '../repositories/user-repository';
import { JwtService } from '@nestjs/jwt';
export declare class UserController {
    private userRepository;
    private authService;
    private jwtService;
    constructor(userRepository: UserRepository, authService: AuthService, jwtService: JwtService);
    create(body: UserBody, ip: string): Promise<void>;
    login(request: any): Promise<{
        access_token: string;
    }>;
    loginWithToken(token: string, response: Response): Response<any, Record<string, any>>;
    isAdmin(): Promise<boolean>;
    getAllAdminNicknames(): Promise<string[]>;
    removeAdmin(request: Request): Promise<{
        nickname: string;
    }>;
    addAdmin(request: Request): Promise<{
        nickname: string;
    }>;
}
