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
exports.GameGateway = void 0;
const socket_io_1 = require("socket.io");
const websockets_1 = require("@nestjs/websockets");
const game_rooms_service_1 = require("./game-rooms.service");
const general_knowledge_service_1 = require("./general-knowledge.service");
let GameGateway = class GameGateway {
    constructor(gameRoomsService, generalKnowledgeService) {
        this.gameRoomsService = gameRoomsService;
        this.generalKnowledgeService = generalKnowledgeService;
    }
    afterInit(server) {
        this.gameRoomsService.startCleaningEmptyRoomsRoutine(server);
    }
    createRoom(client, data) {
        this.gameRoomsService.exitRoomsWhenDisconnecting(client);
        this.gameRoomsService.createRoom(this.server, client, data.nickname, data.miniGameType);
    }
    enterRoom(client, data) {
        this.gameRoomsService.exitRoomsWhenDisconnecting(client);
        this.gameRoomsService.joinRoom(this.server, client, data.nickname, data.roomCode);
    }
    toggleReady(client) {
        const room = this.gameRoomsService.toggleReady(this.server, client);
        if (room) {
            this.gameRoomsService.startGame(this.server, room);
        }
    }
    exit(client) {
        this.gameRoomsService.leaveAllRooms(client);
    }
    answer(client, data) {
        this.generalKnowledgeService.receiveAnswer(this.server, client, data.answer);
    }
    confirmQuestionReceived(client, data) {
        this.generalKnowledgeService.confirmQuestionReceived(this.server, client, data.id);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('create-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "createRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "enterRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toggle-ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "toggleReady", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('exit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "exit", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('answer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "answer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('confirm-question-received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "confirmQuestionReceived", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [game_rooms_service_1.GameRoomsService,
        general_knowledge_service_1.GeneralKnowledgeService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map