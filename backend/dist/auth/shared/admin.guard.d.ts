import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UtilsService } from '../../controllers/shared/utils.service';
import { UserRepository } from '../../repositories/user-repository';
export declare class AdminGuard implements CanActivate {
    private utilsService;
    private userRepository;
    constructor(utilsService: UtilsService, userRepository: UserRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
    throwForbiddenError(): void;
}
