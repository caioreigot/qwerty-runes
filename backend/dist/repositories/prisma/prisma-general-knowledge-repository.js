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
exports.PrismaGeneralKnowledgeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PrismaGeneralKnowledgeRepository = class PrismaGeneralKnowledgeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addNewQuestion(questionTitle, acceptableAnswers, type, content, approved) {
        await this.prisma.generalKnowledgeQuestion.create({
            data: {
                questionTitle: questionTitle.trim(),
                acceptableAnswers: acceptableAnswers.trim(),
                content: content.trim(),
                type,
                approved,
            },
        });
    }
    async getQuestion(id) {
        return this.prisma.generalKnowledgeQuestion.findFirst({
            where: { id },
        });
    }
    async getApprovedQuestionIdentifiers(amount) {
        const identifiers = (await this.prisma.generalKnowledgeQuestion.findMany({
            select: { id: true },
            where: { approved: true },
            take: amount,
        })).map((obj) => obj.id);
        return identifiers.sort(() => 0.5 - Math.random());
    }
    getFirstUnapprovedQuestionOccurrence() {
        return this.prisma.generalKnowledgeQuestion.findFirst({
            where: { approved: false },
        });
    }
    approveQuestion(questionId, changes) {
        const changesTrimmed = {};
        for (const key in changes) {
            changesTrimmed[key] = changes[key].trim();
        }
        return this.prisma.generalKnowledgeQuestion.update({
            where: { id: questionId },
            data: Object.assign(Object.assign({}, changesTrimmed), { approved: true }),
        });
    }
    rejectQuestion(questionId) {
        return this.prisma.generalKnowledgeQuestion.delete({
            where: { id: questionId },
        });
    }
};
PrismaGeneralKnowledgeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaGeneralKnowledgeRepository);
exports.PrismaGeneralKnowledgeRepository = PrismaGeneralKnowledgeRepository;
//# sourceMappingURL=prisma-general-knowledge-repository.js.map