"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralKnowledgeGamePublicState = void 0;
const public_state_1 = require("../public-state");
const scoreboard_item_1 = require("./scoreboard-item");
class GeneralKnowledgeGamePublicState extends public_state_1.PublicState {
    constructor() {
        super(...arguments);
        this.playersAnsweredCorrectly = [];
        this.scoreboard = [];
        this.timerInSeconds = 12;
        this.board = null;
    }
    onPlayerJoin(player) {
        this.players.push(player);
        this.scoreboard.push(new scoreboard_item_1.ScoreboardItem(player.nickname));
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
//# sourceMappingURL=gk-public-state.js.map