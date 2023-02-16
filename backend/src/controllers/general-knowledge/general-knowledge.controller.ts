import { Request } from 'express';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserRepository } from '../../repositories/user-repository';
import { UtilsService } from '../shared/utils.service';
import { AddGeneralKnowledgeBody } from '../../dtos/add-general-knowledge-body';
import { GeneralKnowledgeRepository } from '../../repositories/general-knowledge-repository';
import { AdminGuard } from '../../auth/shared/admin.guard';
import { GeneralKnowledgeQuestion } from '@prisma/client';

@Controller('general-knowledge')
export class GeneralKnowledgeController {
  constructor(
    private utilsService: UtilsService,
    private userRepository: UserRepository,
    private generalKnowledgeRepository: GeneralKnowledgeRepository,
  ) {}

  @Post('add')
  async add(@Req() request: Request, @Body() body: AddGeneralKnowledgeBody): Promise<void> {
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
      body.acceptableAnswers,
      body.type,
      body.content,
      isUserAdmin,
    );
  }

  @UseGuards(AdminGuard)
  @Get('get-unapproved-question')
  async getUnapprovedQuestion(): Promise<GeneralKnowledgeQuestion> {
    return await this.generalKnowledgeRepository.getFirstUnapprovedQuestionOccurrence();
  }

  @UseGuards(AdminGuard)
  @Post('approve-question')
  async approveQuestion(
    @Body() body: { id: number; changes: Partial<GeneralKnowledgeQuestion> },
  ): Promise<GeneralKnowledgeQuestion> {
    return await this.generalKnowledgeRepository.approveQuestion(body.id, body.changes);
  }

  @UseGuards(AdminGuard)
  @Post('reject-question')
  async rejectQuestion(@Body() body: { id: number }): Promise<GeneralKnowledgeQuestion> {
    return await this.generalKnowledgeRepository.rejectQuestion(body.id);
  }
}
