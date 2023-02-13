import { Request } from 'express';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserRepository } from '../../repositories/user-repository';
import { UtilsService } from '../shared/utils.service';
import { AddGeneralKnowledgeBody } from '../../dtos/add-general-knowledge-body';
import { GeneralKnowledgeRepository } from '../../repositories/general-knowledge-repository';

@Controller('general-knowledge')
export class GeneralKnowledgeController {
  constructor(
    private utilsService: UtilsService,
    private userRepository: UserRepository,
    private generalKnowledgeRepository: GeneralKnowledgeRepository,
  ) {}

  @Post('add')
  async add(
    @Req() request: Request,
    @Body() body: AddGeneralKnowledgeBody,
  ): Promise<void> {
    const jwtPayload = this.utilsService.getJwtTokenPayloadFromRequest(request);
    const isUserAdmin = await this.userRepository.isAdmin(jwtPayload.nickname);

    if (body.type === 'image') {
      const img = body.content;
      const buffer = Buffer.from(img.substring(img.indexOf(',') + 1));
      const bufferMB = buffer.length / 1e6;
      if (bufferMB > 1) return;
    }

    this.generalKnowledgeRepository.addNewQuestion(
      body.questionTitle,
      body.type,
      body.content,
      isUserAdmin,
    );
  }
}
