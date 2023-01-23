export abstract class UserRepository {
  abstract create(nickname: string, password: string): Promise<void>;
  abstract validate(nickname: string, password: string): Promise<void>;
}
