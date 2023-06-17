import { Player } from './player';
export declare abstract class PublicState {
    players: Player[];
    gameStarted: boolean;
    abstract disconnectPlayer(player: Player): void;
    abstract toggleReady(player: Player): void;
    abstract onPlayerJoin(player: Player): void;
    constructor(hostNickname: string, hostSocketId: string);
}
