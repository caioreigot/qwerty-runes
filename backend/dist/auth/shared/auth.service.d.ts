import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../repositories/user-repository';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    validate(nickname: string, password: string, remember: boolean): Promise<{
        id: number;
        nickname: string;
        remember: boolean;
    }>;
    buildAndSendToken(nickname: string, remember: boolean): Promise<{
        access_token: string;
    }>;
}
