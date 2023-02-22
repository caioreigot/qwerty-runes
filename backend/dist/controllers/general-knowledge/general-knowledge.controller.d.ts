import { Request } from 'express';
import { UserRepository } from '../../repositories/user-repository';
import { UtilsService } from '../shared/utils.service';
import { AddGeneralKnowledgeBody } from '../../dtos/add-general-knowledge-body';
import { GeneralKnowledgeRepository } from '../../repositories/general-knowledge-repository';
import { GeneralKnowledgeQuestion } from '@prisma/client';
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
