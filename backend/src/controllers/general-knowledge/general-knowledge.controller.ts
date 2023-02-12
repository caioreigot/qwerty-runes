import { Body, Controller, Post } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user-repository';

@Controller('general-knowledge')
export class GeneralKnowledgeController {
  constructor(private userRepository: UserRepository) {}

  @Post('add')
  async add(@Body() body: any): Promise<void> {
    console.log(body);

    const img = body.content;
    const buffer = Buffer.from(img.substring(img.indexOf(',') + 1));
    console.log('Byte length: ' + buffer.length);
    console.log('MB: ' + buffer.length / 1e6);
  }
}
