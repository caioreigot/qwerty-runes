import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(nickname: string, password: string): Promise<void>;
  abstract validate(nickname: string, password: string): Promise<User>;
  abstract isAdmin(nickname: string): Promise<boolean>;
  abstract getAllAdminNicknames(): Promise<string[]>;
  abstract removeAdmin(nickname: string): Promise<{ nickname: string }>;
  abstract addAdmin(nickname: string): Promise<{ nickname: string }>;
}
