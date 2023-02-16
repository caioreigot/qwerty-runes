import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UtilsService } from '../../controllers/shared/utils.service';
import { UserRepository } from '../../repositories/user-repository';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private utilsService: UtilsService, private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = this.utilsService.getJwtTokenPayloadFromRequest(request);

    // Se na requisição não houver um token
    if (!payload) {
      this.throwForbiddenError();
    }

    const isAdmin = await this.userRepository.isAdmin(payload.nickname);

    // Se houver um token mas o usuário não for um administrador
    if (!isAdmin) {
      this.throwForbiddenError();
    }

    return isAdmin;
  }

  throwForbiddenError() {
    throw new HttpException('Você não tem permissão para acessar essa rota.', HttpStatus.FORBIDDEN);
  }
}
