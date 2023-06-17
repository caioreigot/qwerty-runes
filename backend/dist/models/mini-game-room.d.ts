import { GameState } from './game-state';
import { MiniGameType } from './mini-game-type';
import { PublicState } from './public-state';
export declare class MiniGameRoom {
    code: string;
    miniGameType: MiniGameType;
    state: GameState<PublicState>;
    constructor(code: string, miniGameType: MiniGameType, state: GameState<any>);
}
