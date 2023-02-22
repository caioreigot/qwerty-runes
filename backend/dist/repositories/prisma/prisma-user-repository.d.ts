import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UserRepository } from '../user-repository';
export declare class PrismaUserRepository implements UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(nickname: string, password: string): Promise<void>;
    validate(nickname: string, password: string): Promise<User>;
    isAdmin(nickname: string): Promise<boolean>;
    getAllAdminNicknames(): Promise<string[]>;
    removeAdmin(nickname: string): Promise<{
        nickname: string;
    }>;
    addAdmin(nickname: string): Promise<{
        nickname: string;
    }>;
}
