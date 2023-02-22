"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralKnowledgeGameState = exports.ScoreboardItem = exports.GeneralKnowledgeGamePublicState = exports.GeneralKnowledgeQuestionType = void 0;
const mini_game_1 = require("./mini-game");
var GeneralKnowledgeQuestionType;
(function (GeneralKnowledgeQuestionType) {
    GeneralKnowledgeQuestionType["IMAGE"] = "image";
    GeneralKnowledgeQuestionType["TEXT"] = "text";
})(GeneralKnowledgeQuestionType = exports.GeneralKnowledgeQuestionType || (exports.GeneralKnowledgeQuestionType = {}));
class Scoreboard {
}
class Board {
}
class GeneralKnowledgeGamePublicState extends mini_game_1.PublicState {
    constructor() {
        super(...arguments);
        this.playersAnsweredCorrectly = [];
        this.scoreboard = [];
        this.timerInSeconds = 12;
        this.board = null;
    }
    onPlayerJoin(player) {
        this.players.push(player);
        this.scoreboard.push(new ScoreboardItem(player.nickname));
    }
    toggleReady(player) {
        const targetPlayer = this.scoreboard.find((scoreboardItem) => {
            return scoreboardItem.nickname === player.nickname;
        });
        targetPlayer.isReady = !targetPlayer.isReady;
    }
    disconnectPlayer(player) {
        const playerLeavingIndex = this.players.findIndex((currentPlayer) => currentPlayer.socketId === player.socketId);
        const scoreboardItemToRemoveIndex = this.scoreboard.findIndex((scoreboardItem) => scoreboardItem.nickname === player.nickname);
        this.players.splice(playerLeavingIndex, 1);
        this.scoreboard.splice(scoreboardItemToRemoveIndex, 1);
    }
}
exports.GeneralKnowledgeGamePublicState = GeneralKnowledgeGamePublicState;
class ScoreboardItem {
    constructor(nickname) {
        this.nickname = nickname;
        this.score = 0;
        this.isReady = false;
        this.lastGuess = '';
    }
}
exports.ScoreboardItem = ScoreboardItem;
class GeneralKnowledgeGameState extends mini_game_1.GameState {
    resetTimer() {
        this.public.timerInSeconds = this.timeInSecondsToAnswer;
    }
    constructor(hostNickname, hostSocketId) {
        super(new GeneralKnowledgeGamePublicState(hostNickname, hostSocketId));
        this.timeInSecondsToAnswer = 12;
        this.boardQuestionsIdQueue = [];
        this.receiptConfirmations = [];
        this.public.scoreboard.push(new ScoreboardItem(hostNickname));
    }
}
exports.GeneralKnowledgeGameState = GeneralKnowledgeGameState;
//# sourceMappingURL=general-knowledge.js.map