"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralKnowledgeGameState = void 0;
const game_state_1 = require("../game-state");
const gk_public_state_1 = require("./gk-public-state");
const scoreboard_item_1 = require("./scoreboard-item");
class GeneralKnowledgeGameState extends game_state_1.GameState {
    resetTimer() {
        this.public.timerInSeconds = this.timeInSecondsToAnswer;
    }
    constructor(hostNickname, hostSocketId) {
        super(new gk_public_state_1.GeneralKnowledgeGamePublicState(hostNickname, hostSocketId));
        this.timeInSecondsToAnswer = 12;
        this.boardQuestionsIdQueue = [];
        this.receiptConfirmations = [];
        this.public.scoreboard.push(new scoreboard_item_1.ScoreboardItem(hostNickname));
    }
}
exports.GeneralKnowledgeGameState = GeneralKnowledgeGameState;
//# sourceMappingURL=gk-game-state.js.map