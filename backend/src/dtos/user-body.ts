import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserBody {
  @IsNotEmpty({ message: 'O campo de apelido não pode estar vazio.' })
  @MaxLength(20, { message: 'O nickname não pode ter mais do que 20 caracteres.' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  nickname: string;

  @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' })
  password: string;
}
