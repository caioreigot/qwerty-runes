import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GeneralKnowledgeQuestionType } from 'src/models/general-knowledge/gk-question-type';

export class AddGeneralKnowledgeBody {
  @IsNotEmpty({ message: 'O título da pergunta não pode estar vazio.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  questionTitle: string;

  @IsNotEmpty({ message: 'As respostas aceitáveis não podem estar vazias.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  acceptableAnswers: string;

  @IsEnum(GeneralKnowledgeQuestionType)
  type: GeneralKnowledgeQuestionType;

  @IsNotEmpty({
    message: 'O conteúdo (imagem ou texto) da pergunta não pode estar vazio.',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
}
