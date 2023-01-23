import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user-repository';
import { createHash } from 'crypto';

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

  async validate(nickname: string, password: string): Promise<void> {
    const hash = createHash('sha256').update(password).digest('hex');

    await this.prisma.user.findFirstOrThrow({
      where: {
        nickname: nickname,
        passwordHash: hash,
      },
    });
  }
}
