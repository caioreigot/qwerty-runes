import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UtilsService } from 'src/controllers/shared/utils.service';
import { UserRepository } from 'src/repositories/user-repository';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private utilsService: UtilsService, private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = this.utilsService.getJwtTokenPayloadFromRequest(request);

    // Se não houver um token na requisição
    if (!payload) {
      this.throwForbiddenError();
    }

    const isAdmin = await this.userRepository.isAdmin(payload.nickname);

    // Se o usuário não for admin
    if (!isAdmin) {
      this.throwForbiddenError();
    }

    return isAdmin;
  }

  throwForbiddenError() {
    throw new HttpException(
      'Você não tem permissão para acessar essa rota.',
      HttpStatus.FORBIDDEN
    );
  }
}
