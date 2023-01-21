import { PrismaService } from '../../database/prisma.service';
import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user-repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(nickname: string, password: string): Promise<void> {
    const hash = createHash('sha256');
    const passwordHash = hash.update(password).digest('hex');

    await this.prisma.user.create({
      data: {
        nickname,
        passwordHash,
      },
    });
  }
}
