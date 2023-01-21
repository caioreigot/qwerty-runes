import { IsNotEmpty, MinLength } from 'class-validator';

export class UserBody {
  @IsNotEmpty({ message: 'O campo de apelido não pode estar vazio.' })
  nickname: string;

  @MinLength(5, { message: 'A senha precisa ter no mínimo 5 caracteres.' })
  password: string;
}
