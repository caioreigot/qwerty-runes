"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniGameRoom = exports.GameState = exports.PublicState = exports.MiniGameType = void 0;
var MiniGameType;
(function (MiniGameType) {
    MiniGameType["GENERAL_KNOWLEDGE"] = "general-knowledge";
})(MiniGameType = exports.MiniGameType || (exports.MiniGameType = {}));
class PublicState {
    constructor(hostNickname, hostSocketId) {
        this.gameStarted = false;
        this.players = [{ nickname: hostNickname, socketId: hostSocketId }];
    }
}
exports.PublicState = PublicState;
class GameState {
    constructor(publicState) {
        this.public = publicState;
    }
}
exports.GameState = GameState;
class MiniGameRoom {
    constructor(code, miniGameType, state) {
        this.code = code;
        this.miniGameType = miniGameType;
        this.state = state;
    }
}
exports.MiniGameRoom = MiniGameRoom;
//# sourceMappingURL=mini-game.js.map