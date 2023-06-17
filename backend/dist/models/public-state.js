"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicState = void 0;
class PublicState {
    constructor(hostNickname, hostSocketId) {
        this.gameStarted = false;
        this.players = [
            {
                nickname: hostNickname,
                socketId: hostSocketId,
            },
        ];
    }
}
exports.PublicState = PublicState;
//# sourceMappingURL=public-state.js.map