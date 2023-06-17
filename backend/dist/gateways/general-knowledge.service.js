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
exports.GeneralKnowledgeService = void 0;
const general_knowledge_repository_1 = require("../repositories/general-knowledge-repository");
const common_1 = require("@nestjs/common");
const game_rooms_service_1 = require("./game-rooms.service");
const gk_game_state_1 = require("../models/general-knowledge/gk-game-state");
let GeneralKnowledgeService = class GeneralKnowledgeService {
    constructor(generalKnowledgeRepository) {
        this.generalKnowledgeRepository = generalKnowledgeRepository;
    }
    confirmQuestionReceived(server, socket, questionId) {
        const room = game_rooms_service_1.GameRoomsService.rooms.find((room) => {
            return socket.rooms.has(room.code);
        });
        if ((room === null || room === void 0 ? void 0 : room.state) instanceof gk_game_state_1.GeneralKnowledgeGameState) {
            const roomReceiptConfirmations = room.state.receiptConfirmations;
            let receiptConfirmationItem = roomReceiptConfirmations.find((confirmation) => confirmation.questionId === questionId);
            if (!receiptConfirmationItem) {
                roomReceiptConfirmations.push({ questionId, confirmedSocketIds: [] });
                receiptConfirmationItem = roomReceiptConfirmations[roomReceiptConfirmations.length - 1];
            }
            receiptConfirmationItem.confirmedSocketIds.push(socket.id);
            const players = room.state.public.players;
            let allIdsPresent = true;
            for (let i = 0; i < players.length; i++) {
                if (!receiptConfirmationItem.confirmedSocketIds.includes(players[i].socketId)) {
                    allIdsPresent = false;
                    break;
                }
            }
            if (allIdsPresent) {
                const indexToRemove = room.state.receiptConfirmations.indexOf(receiptConfirmationItem);
                room.state.receiptConfirmations.splice(indexToRemove, 1);
                room.state.resetTimer();
                this.startDecreasingTimerAndEmit(server, room);
                server.to(room.code).emit('all-sockets-ready');
            }
        }
    }
    splitAcceptableAnswers(acceptableAnswers) {
        var _a;
        return (_a = acceptableAnswers === null || acceptableAnswers === void 0 ? void 0 : acceptableAnswers.split(',').map((answer) => answer.trim())) !== null && _a !== void 0 ? _a : [];
    }
    startDecreasingTimerAndEmit(server, room) {
        const decrementer = setInterval(() => {
            const roomState = room.state;
            const timer = roomState.public.timerInSeconds;
            if (timer <= 0) {
                const acceptableAnswers = this.splitAcceptableAnswers(roomState.currentAcceptableAnswers);
                roomState.public.correctAnswer = acceptableAnswers[0];
                server.to(room.code).emit('state-changed', room.state.public);
                setTimeout(() => {
                    this.sendNewQuestionOrFinishGame(server, room);
                }, 4000);
                clearInterval(decrementer);
                return;
            }
            roomState.public.timerInSeconds--;
            server.to(room.code).emit('state-changed', room.state.public);
        }, 1000);
    }
    async sendNewQuestionOrFinishGame(server, room) {
        if (!(room.state instanceof gk_game_state_1.GeneralKnowledgeGameState))
            return;
        if (room.state.boardQuestionsIdQueue.length === 0) {
            server.to(room.code).emit('game-ended');
            return;
        }
        room.state.boardQuestionsIdQueue[0];
        const question = await this.generalKnowledgeRepository.getQuestion(room.state.boardQuestionsIdQueue[0]);
        if (!question)
            return;
        room.state.boardQuestionsIdQueue.splice(0, 1);
        room.state.public.correctAnswer = null;
        room.state.public.playersAnsweredCorrectly = [];
        room.state.currentAcceptableAnswers = question.acceptableAnswers;
        room.state.public.board = {
            id: question.id,
            questionTitle: question.questionTitle,
            type: question.type,
            content: question.content,
        };
        server.to(room.code).emit('state-changed', room.state.public);
    }
    receiveAnswer(server, socket, answer) {
        game_rooms_service_1.GameRoomsService.rooms.forEach((room) => {
            var _a;
            if (!(room.state instanceof gk_game_state_1.GeneralKnowledgeGameState))
                return;
            const targetNickname = (_a = room.state.public.players.find((player) => player.socketId == socket.id)) === null || _a === void 0 ? void 0 : _a.nickname;
            if (!targetNickname)
                return;
            const answersLowerCase = this.splitAcceptableAnswers(room.state.currentAcceptableAnswers).map((answer) => answer.toLowerCase());
            const playerAnsweredCorrectly = answersLowerCase.includes(answer.toLowerCase());
            if (room.state instanceof gk_game_state_1.GeneralKnowledgeGameState) {
                room.state.public.scoreboard.forEach((scoreboardItem) => {
                    if (scoreboardItem.nickname === targetNickname) {
                        if (playerAnsweredCorrectly) {
                            const roomState = room.state;
                            if (roomState.public.playersAnsweredCorrectly.length >= 1) {
                                scoreboardItem.score += Math.max(roomState.public.timerInSeconds - 1, 1);
                            }
                            else {
                                scoreboardItem.score += roomState.public.timerInSeconds;
                            }
                            roomState.public.playersAnsweredCorrectly.push(targetNickname);
                            scoreboardItem.lastGuess = '';
                            return;
                        }
                        scoreboardItem.lastGuess = answer;
                    }
                });
            }
            server.to(room.code).emit('state-changed', room.state.public);
        });
    }
};
GeneralKnowledgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [general_knowledge_repository_1.GeneralKnowledgeRepository])
], GeneralKnowledgeService);
exports.GeneralKnowledgeService = GeneralKnowledgeService;
//# sourceMappingURL=general-knowledge.service.js.map