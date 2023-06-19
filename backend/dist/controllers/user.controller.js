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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const auth_service_1 = require("../auth/shared/auth.service");
const common_1 = require("@nestjs/common");
const user_body_1 = require("../dtos/user-body");
const user_repository_1 = require("../repositories/user-repository");
const local_auth_guard_1 = require("../auth/shared/guards/local-auth.guard");
const jwt_auth_guard_1 = require("../auth/shared/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/shared/guards/admin.guard");
const jwt_1 = require("@nestjs/jwt");
let UserController = class UserController {
    constructor(userRepository, authService, jwtService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async create(body) {
        try {
            await this.userRepository.create(body.nickname, body.password);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.HttpException('Este nickname já está em uso! Por favor, escolha outro.', common_1.HttpStatus.CONFLICT);
                }
                throw error;
            }
            throw error;
        }
    }
    async login(request) {
        return this.authService.buildAndSendToken(request.user.nickname, request.body.remember);
    }
    loginWithToken(token, response) {
        const jwt = token.replace('Bearer ', '');
        try {
            this.jwtService.verify(jwt);
        }
        catch (error) {
            throw new common_1.ForbiddenException("O token fornecido não é válido.");
        }
        const jwtDecoded = this.jwtService.decode(jwt);
        if (!jwtDecoded.renewSession) {
            return response.status(common_1.HttpStatus.OK).send();
        }
        const payload = {
            nickname: jwtDecoded.nickname,
            renewSession: true
        };
        const options = { expiresIn: '72h' };
        response.status(common_1.HttpStatus.OK).json({
            access_token: this.jwtService.sign(payload, options),
        });
    }
    async isAdmin() {
        return;
    }
    async getAllAdminNicknames() {
        return this.userRepository.getAllAdminNicknames();
    }
    async removeAdmin(request) {
        return this.userRepository.removeAdmin(request.body.nickname);
    }
    async addAdmin(request) {
        return this.userRepository.addAdmin(request.body.nickname);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_body_1.UserBody]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('token-login'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "loginWithToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)('is-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('get-all-admin-nicknames'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllAdminNicknames", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('remove-admin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)('add-admin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addAdmin", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map