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
exports.AddGeneralKnowledgeBody = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const general_knowledge_1 = require("../models/general-knowledge");
class AddGeneralKnowledgeBody {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O título da pergunta não pode estar vazio.' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], AddGeneralKnowledgeBody.prototype, "questionTitle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'As respostas aceitáveis não podem estar vazias.' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], AddGeneralKnowledgeBody.prototype, "acceptableAnswers", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(general_knowledge_1.GeneralKnowledgeQuestionType),
    __metadata("design:type", String)
], AddGeneralKnowledgeBody.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: 'O conteúdo (imagem ou texto) da pergunta não pode estar vazio.',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], AddGeneralKnowledgeBody.prototype, "content", void 0);
exports.AddGeneralKnowledgeBody = AddGeneralKnowledgeBody;
//# sourceMappingURL=add-general-knowledge-body.js.map