import { Test, TestingModule } from '@nestjs/testing';
import { GeneralKnowledgeController } from './general-knowledge.controller';

describe('GeneralKnowledgeController', () => {
  let controller: GeneralKnowledgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralKnowledgeController],
    }).compile();

    controller = module.get<GeneralKnowledgeController>(GeneralKnowledgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
