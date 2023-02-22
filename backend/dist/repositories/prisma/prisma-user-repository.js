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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(nickname, password) {
        const hash = (0, crypto_1.createHash)('sha256');
        const passwordHash = hash.update(password).digest('hex');
        await this.prisma.user.create({
            data: {
                nickname,
                passwordHash,
            },
        });
        const users = await this.prisma.user.findMany();
        console.log(users);
    }
    async validate(nickname, password) {
        const hash = (0, crypto_1.createHash)('sha256').update(password).digest('hex');
        return await this.prisma.user.findFirstOrThrow({
            where: {
                nickname: nickname,
                passwordHash: hash,
            },
        });
    }
    async isAdmin(nickname) {
        const user = await this.prisma.user.findFirstOrThrow({
            where: {
                nickname: nickname,
            },
        });
        return user.isAdmin;
    }
    async getAllAdminNicknames() {
        const admins = await this.prisma.user.findMany({
            where: { isAdmin: true },
            select: { nickname: true },
        });
        return admins.map((admin) => admin.nickname);
    }
    async removeAdmin(nickname) {
        return await this.prisma.user.update({
            where: { nickname },
            data: { isAdmin: false },
            select: { nickname: true },
        });
    }
    async addAdmin(nickname) {
        try {
            return await this.prisma.user.update({
                where: { nickname },
                data: { isAdmin: true },
                select: { nickname: true },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                switch (e.code) {
                    case 'P2025':
                        throw new common_1.NotFoundException('Não existe um usuário com este nickname.');
                }
            }
            throw e;
        }
    }
};
PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
exports.PrismaUserRepository = PrismaUserRepository;
//# sourceMappingURL=prisma-user-repository.js.map