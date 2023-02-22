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
var GameRoomsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoomsService = void 0;
const randomstring = require("randomstring");
const common_1 = require("@nestjs/common");
const general_knowledge_1 = require("../models/general-knowledge");
const mini_game_1 = require("../models/mini-game");
const general_knowledge_repository_1 = require("../repositories/general-knowledge-repository");
let GameRoomsService = GameRoomsService_1 = class GameRoomsService {
    constructor(generalKnowledgeRepository) {
        this.generalKnowledgeRepository = generalKnowledgeRepository;
    }
    startCleaningEmptyRoomsRoutine(server) {
        const intervalInMinutes = 5;
        setInterval(() => {
            GameRoomsService_1.rooms.forEach((room) => {
                var _a, _b;
                const roomSize = (_b = (_a = server.sockets.adapter.rooms.get(room.code)) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0;
                if (roomSize === 0)
                    this.removeRoom(room.code);
            });
        }, 1000 * 60 * intervalInMinutes);
    }
    generateRandomCode(codeLength) {
        return randomstring
            .generate({
            length: codeLength,
            charset: 'alphabetic',
        })
            .toUpperCase();
    }
    createRoom(server, hostSocket, hostNickname, miniGameType) {
        let iterations = 0;
        const joinRoomAndEmitCode = (roomCode) => {
            const newMiniGameRoom = (function () {
                const gameState = (function () {
                    switch (miniGameType) {
                        case mini_game_1.MiniGameType.GENERAL_KNOWLEDGE:
                            return new general_knowledge_1.GeneralKnowledgeGameState(hostNickname, hostSocket.id);
                        default:
                            throw new Error('GameState não instanciado.');
                    }
                })();
                return new mini_game_1.MiniGameRoom(roomCode, miniGameType, gameState);
            })();
            GameRoomsService_1.rooms.push(newMiniGameRoom);
            hostSocket.join(roomCode);
            hostSocket.emit('room-code', roomCode);
            hostSocket.emit('state-changed', newMiniGameRoom.state.public);
        };
        while (true) {
            if (iterations > 26 ** GameRoomsService_1.ROOM_CODE_LENGTH) {
                const bigGeneratedRandomCode = this.generateRandomCode(6);
                joinRoomAndEmitCode(bigGeneratedRandomCode);
                break;
            }
            const roomCode = this.generateRandomCode(GameRoomsService_1.ROOM_CODE_LENGTH);
            const roomAlreadyCreated = Boolean(server.sockets.adapter.rooms.get(roomCode));
            if (!roomAlreadyCreated) {
                joinRoomAndEmitCode(roomCode);
                break;
            }
            iterations++;
        }
    }
    joinRoom(server, socket, nickname, roomCodeArg) {
        const roomCode = roomCodeArg.toUpperCase();
        const targetRoom = GameRoomsService_1.rooms.find((room) => room.code === roomCode);
        if (!targetRoom) {
            socket.emit('error', 'Esta sala não existe.');
            return;
        }
        if (targetRoom.state.public.gameStarted) {
            socket.emit('error', 'O jogo já começou nesta sala.');
            return;
        }
        for (let j = 0; j < targetRoom.state.public.players.length; j++) {
            const currentNickname = targetRoom.state.public.players[j].nickname;
            if (nickname === currentNickname) {
                socket.emit('error', 'Você já está conectado na sala.');
                return;
            }
        }
        const player = { nickname: nickname, socketId: socket.id };
        targetRoom.state.public.onPlayerJoin(player);
        socket.join(roomCode);
        socket.emit('entered-room');
        server.to(roomCode).emit('state-changed', targetRoom.state.public);
    }
    async startGame(server, room) {
        const roomToStartGame = GameRoomsService_1.rooms.find((currentRoom) => currentRoom.code === room.code);
        if (!roomToStartGame)
            return;
        roomToStartGame.state.public.gameStarted = true;
        if (room.state instanceof general_knowledge_1.GeneralKnowledgeGameState) {
            room.state.boardQuestionsIdQueue =
                await this.generalKnowledgeRepository.getApprovedQuestionIdentifiers(20);
            const question = await this.generalKnowledgeRepository.getQuestion(room.state.boardQuestionsIdQueue[0]);
            if (!question)
                return;
            room.state.boardQuestionsIdQueue.splice(0, 1);
            room.state.currentAcceptableAnswers = question.acceptableAnswers;
            room.state.public.board = {
                id: question.id,
                questionTitle: question.questionTitle,
                type: question.type,
                content: question.content,
            };
        }
        else {
            throw Error('Está faltando uma implementação de início de jogo para o GameState passado.');
        }
        server.to(roomToStartGame.code).emit('state-changed', room.state.public);
    }
    toggleReady(server, socket) {
        for (let i = 0; i < GameRoomsService_1.rooms.length; i++) {
            const room = GameRoomsService_1.rooms[i];
            for (let j = 0; j < room.state.public.players.length; j++) {
                const player = room.state.public.players[j];
                if (player.socketId !== socket.id)
                    continue;
                room.state.public.toggleReady(player);
                server.to(room.code).emit('state-changed', room.state.public);
                if (room.state instanceof general_knowledge_1.GeneralKnowledgeGameState) {
                    const playersNotReady = room.state.public.scoreboard.filter((scoreboard) => {
                        return scoreboard.isReady === false;
                    });
                    if (playersNotReady.length === 0) {
                        return room;
                    }
                }
            }
        }
        return null;
    }
    exitRoomsWhenDisconnecting(socket) {
        socket.on('disconnecting', () => {
            this.leaveAllRooms(socket);
        });
    }
    leaveAllRooms(socket) {
        GameRoomsService_1.rooms.forEach((room) => {
            room.state.public.players.forEach((player) => {
                if (player.socketId !== socket.id)
                    return;
                room.state.public.disconnectPlayer(player);
                socket.leave(room.code);
                socket.to(room.code).emit('state-changed', room.state.public);
            });
        });
    }
    removeRoom(roomCode) {
        const roomIndex = GameRoomsService_1.rooms.findIndex((room) => room.code === roomCode);
        GameRoomsService_1.rooms.splice(roomIndex, 1);
    }
};
GameRoomsService.rooms = [];
GameRoomsService.ROOM_CODE_LENGTH = 4;
GameRoomsService = GameRoomsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [general_knowledge_repository_1.GeneralKnowledgeRepository])
], GameRoomsService);
exports.GameRoomsService = GameRoomsService;
//# sourceMappingURL=game-rooms.service.js.map