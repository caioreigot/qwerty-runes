import { Request } from 'express';
import { GeneralKnowledgeQuestion } from '@prisma/client';
import { UtilsService } from './shared/utils.service';
import { UserRepository } from 'src/repositories/user-repository';
import { GeneralKnowledgeRepository } from 'src/repositories/general-knowledge-repository';
import { AddGeneralKnowledgeBody } from 'src/dtos/add-general-knowledge-body';
export declare class GeneralKnowledgeController {
    private utilsService;
    private userRepository;
    private generalKnowledgeRepository;
    constructor(utilsService: UtilsService, userRepository: UserRepository, generalKnowledgeRepository: GeneralKnowledgeRepository);
    add(request: Request, body: AddGeneralKnowledgeBody): Promise<void>;
    getUnapprovedQuestion(): Promise<GeneralKnowledgeQuestion>;
    approveQuestion(body: {
        id: number;
        changes: Partial<GeneralKnowledgeQuestion>;
    }): Promise<GeneralKnowledgeQuestion>;
    rejectQuestion(body: {
        id: number;
    }): Promise<GeneralKnowledgeQuestion>;
}
