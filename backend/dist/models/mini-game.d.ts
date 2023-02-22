export declare enum MiniGameType {
    GENERAL_KNOWLEDGE = "general-knowledge"
}
export interface Player {
    nickname: string;
    socketId: string;
}
export declare abstract class PublicState {
    players: Player[];
    gameStarted: boolean;
    abstract disconnectPlayer(player: Player): any;
    abstract toggleReady(player: Player): any;
    abstract onPlayerJoin(player: Player): any;
    constructor(hostNickname: any, hostSocketId: any);
}
export declare class GameState<T extends PublicState> {
    public: T;
    constructor(publicState: T);
}
export declare class MiniGameRoom {
    code: string;
    miniGameType: MiniGameType;
    state: GameState<PublicState>;
    constructor(code: string, miniGameType: MiniGameType, state: GameState<any>);
}
