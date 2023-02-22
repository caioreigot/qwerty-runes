"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const utils_service_1 = require("../../controllers/shared/utils.service");
const user_repository_1 = require("../../repositories/user-repository");
let AdminGuard = class AdminGuard {
    constructor(utilsService, userRepository) {
        this.utilsService = utilsService;
        this.userRepository = userRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const payload = this.utilsService.getJwtTokenPayloadFromRequest(request);
        if (!payload) {
            this.throwForbiddenError();
        }
        const isAdmin = await this.userRepository.isAdmin(payload.nickname);
        if (!isAdmin) {
            this.throwForbiddenError();
        }
        return isAdmin;
    }
    throwForbiddenError() {
        throw new common_1.HttpException('Você não tem permissão para acessar essa rota.', common_1.HttpStatus.FORBIDDEN);
    }
};
AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [utils_service_1.UtilsService, user_repository_1.UserRepository])
], AdminGuard);
exports.AdminGuard = AdminGuard;
//# sourceMappingURL=admin.guard.js.map