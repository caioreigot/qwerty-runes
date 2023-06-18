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
exports.GeneralKnowledgeController = void 0;
const common_1 = require("@nestjs/common");
const utils_service_1 = require("./shared/utils.service");
const user_repository_1 = require("../repositories/user-repository");
const general_knowledge_repository_1 = require("../repositories/general-knowledge-repository");
const add_general_knowledge_body_1 = require("../dtos/add-general-knowledge-body");
const admin_guard_1 = require("../auth/shared/guards/admin.guard");
let GeneralKnowledgeController = class GeneralKnowledgeController {
    constructor(utilsService, userRepository, generalKnowledgeRepository) {
        this.utilsService = utilsService;
        this.userRepository = userRepository;
        this.generalKnowledgeRepository = generalKnowledgeRepository;
    }
    async add(request, body) {
        const jwtPayload = this.utilsService.getJwtTokenPayloadFromRequest(request);
        const isUserAdmin = await this.userRepository.isAdmin(jwtPayload.nickname);
        if (body.type === 'image') {
            const img = body.content;
            const buffer = Buffer.from(img.substring(img.indexOf(',') + 1));
            const bufferMB = buffer.length / 1e6;
            if (bufferMB > 1)
                return;
        }
        this.generalKnowledgeRepository.addNewQuestion(body.questionTitle, body.acceptableAnswers, body.type, body.content, isUserAdmin);
    }
    async getUnapprovedQuestion() {
        return await this.generalKnowledgeRepository.getFirstUnapprovedQuestionOccurrence();
    }
    async approveQuestion(body) {
        return await this.generalKnowledgeRepository.approveQuestion(body.id, body.changes);
    }
    async rejectQuestion(body) {
        return await this.generalKnowledgeRepository.rejectQuestion(body.id);
    }
};
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_general_knowledge_body_1.AddGeneralKnowledgeBody]),
    __metadata("design:returntype", Promise)
], GeneralKnowledgeController.prototype, "add", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Get)('get-unapproved-question'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeneralKnowledgeController.prototype, "getUnapprovedQuestion", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)('approve-question'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GeneralKnowledgeController.prototype, "approveQuestion", null);
__decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Post)('reject-question'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GeneralKnowledgeController.prototype, "rejectQuestion", null);
GeneralKnowledgeController = __decorate([
    (0, common_1.Controller)('general-knowledge'),
    __metadata("design:paramtypes", [utils_service_1.UtilsService,
        user_repository_1.UserRepository,
        general_knowledge_repository_1.GeneralKnowledgeRepository])
], GeneralKnowledgeController);
exports.GeneralKnowledgeController = GeneralKnowledgeController;
//# sourceMappingURL=general-knowledge.controller.js.map