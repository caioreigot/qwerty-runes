import { Body, Controller, Post } from '@nestjs/common';
import { UserBody } from './dtos/create-user-body';
import { UserRepository } from './repositories/user-repository';

@Controller()
export class AppController {
  constructor(private userRepository: UserRepository) {}

  @Post('create')
  async create(@Body() body: UserBody) {
    await this.userRepository.create(body.nickname, body.password);
  }
}
