"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaysModule = void 0;
const common_1 = require("@nestjs/common");
const game_gateway_1 = require("./game.gateway");
const game_rooms_service_1 = require("./game-rooms.service");
const general_knowledge_repository_1 = require("../repositories/general-knowledge-repository");
const prisma_general_knowledge_repository_1 = require("../repositories/prisma/prisma-general-knowledge-repository");
const prisma_service_1 = require("../database/prisma.service");
const general_knowledge_service_1 = require("./general-knowledge.service");
const UseGeneralKnowledgeRepositoryWithPrisma = {
    provide: general_knowledge_repository_1.GeneralKnowledgeRepository,
    useClass: prisma_general_knowledge_repository_1.PrismaGeneralKnowledgeRepository,
};
let GatewaysModule = class GatewaysModule {
};
GatewaysModule = __decorate([
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            game_gateway_1.GameGateway,
            game_rooms_service_1.GameRoomsService,
            general_knowledge_service_1.GeneralKnowledgeService,
            UseGeneralKnowledgeRepositoryWithPrisma,
        ],
    })
], GatewaysModule);
exports.GatewaysModule = GatewaysModule;
//# sourceMappingURL=gateways.module.js.map