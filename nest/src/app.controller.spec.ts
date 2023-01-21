import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository';

describe('AppController', () => {
  let prisma: PrismaClient;
  let controller: AppController;

  beforeAll(async () => {
    prisma = new PrismaClient();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        PrismaService,
        {
          provide: UserRepository,
          useClass: PrismaUserRepository,
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should add a user to the user table', async () => {
    const userInput = { nickname: 'John Doe', password: 'foo' };

    await controller.create(userInput);

    const userFromDb = await prisma.user.findUnique({
      where: { nickname: userInput.nickname },
    });

    expect(userFromDb).toMatchObject({ nickname: userInput.nickname });
  });
});
