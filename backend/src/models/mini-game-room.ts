import { GameState } from './game-state';
import { MiniGameType } from './mini-game-type';
import { PublicState } from './public-state';

export class MiniGameRoom {
  
  code: string;
  miniGameType: MiniGameType;
  state: GameState<PublicState>;

  constructor(code: string, miniGameType: MiniGameType, state: GameState<any>) {
    this.code = code;
    this.miniGameType = miniGameType;
    this.state = state;
  }
}
