"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const utils_service_1 = require("./controllers/shared/utils.service");
const auth_module_1 = require("./auth/auth.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./database/prisma.service");
const user_repository_1 = require("./repositories/user-repository");
const prisma_user_repository_1 = require("./repositories/prisma/prisma-user-repository");
const serve_static_1 = require("@nestjs/serve-static");
const gateways_module_1 = require("./gateways/gateways.module");
const general_knowledge_repository_1 = require("./repositories/general-knowledge-repository");
const prisma_general_knowledge_repository_1 = require("./repositories/prisma/prisma-general-knowledge-repository");
const user_controller_1 = require("./controllers/user.controller");
const general_knowledge_controller_1 = require("./controllers/general-knowledge.controller");
const healthz_controller_1 = require("./controllers/healthz.controller");
const ConfiguredServeStaticModule = serve_static_1.ServeStaticModule.forRoot({
    rootPath: (0, path_1.join)(__dirname, 'front'),
});
const UseUserRepositoryWithPrisma = {
    provide: user_repository_1.UserRepository,
    useClass: prisma_user_repository_1.PrismaUserRepository,
};
const UseGeneralKnowledgeRepositoryWithPrisma = {
    provide: general_knowledge_repository_1.GeneralKnowledgeRepository,
    useClass: prisma_general_knowledge_repository_1.PrismaGeneralKnowledgeRepository,
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            gateways_module_1.GatewaysModule,
            ConfiguredServeStaticModule
        ],
        controllers: [
            user_controller_1.UserController,
            general_knowledge_controller_1.GeneralKnowledgeController,
            healthz_controller_1.HealthzController
        ],
        providers: [
            prisma_service_1.PrismaService,
            UseUserRepositoryWithPrisma,
            UseGeneralKnowledgeRepositoryWithPrisma,
            utils_service_1.UtilsService,
        ],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map