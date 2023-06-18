"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./shared/constants");
const auth_service_1 = require("./shared/auth.service");
const jwt_strategy_1 = require("./shared/strategies/jwt.strategy");
const local_strategy_service_1 = require("./shared/strategies/local-strategy.service");
const prisma_service_1 = require("../database/prisma.service");
const user_repository_1 = require("../repositories/user-repository");
const prisma_user_repository_1 = require("../repositories/prisma/prisma-user-repository");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '336h' },
            }),
        ],
        controllers: [],
        providers: [
            prisma_service_1.PrismaService,
            auth_service_1.AuthService,
            local_strategy_service_1.LocalStrategyService,
            jwt_strategy_1.JwtStrategy,
            {
                provide: user_repository_1.UserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map