import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GeneralKnowledgeQuestionType } from '../models/general-knowledge';

export class AddGeneralKnowledgeBody {
  @IsNotEmpty({ message: 'O título da pergunta não pode estar vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  questionTitle: string;

  @IsEnum(GeneralKnowledgeQuestionType)
  type: GeneralKnowledgeQuestionType;

  @IsNotEmpty({
    message: 'O conteúdo (imagem ou texto) da pergunta não pode estar vazio.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
}
