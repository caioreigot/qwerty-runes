import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
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

  async validate(nickname: string, password: string): Promise<User> {
    const hash = createHash('sha256').update(password).digest('hex');

    return await this.prisma.user.findFirstOrThrow({
      where: {
        nickname: nickname,
        passwordHash: hash,
      },
    });
  }

  async isAdmin(nickname: string): Promise<boolean> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        nickname: nickname,
      },
    });

    return user.isAdmin;
  }

  async getAllAdminNicknames(): Promise<string[]> {
    const admins = await this.prisma.user.findMany({
      where: { isAdmin: true },
      select: { nickname: true },
    });

    return admins.map((admin) => admin.nickname);
  }

  async removeAdmin(nickname: string): Promise<{ nickname: string }> {
    return await this.prisma.user.update({
      where: { nickname },
      data: { isAdmin: false },
      select: { nickname: true },
    });
  }

  async addAdmin(nickname: string): Promise<{ nickname: string }> {
    try {
      return await this.prisma.user.update({
        where: { nickname },
        data: { isAdmin: true },
        select: { nickname: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2025':
            throw new NotFoundException('Não existe um usuário com este nickname.');
        }
      }

      throw e;
    }
  }
}
