import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(nickname: string, password: string): Promise<void>;
  abstract validate(nickname: string, password: string): Promise<User>;
  abstract isAdmin(nickname: string): Promise<boolean>;
}
