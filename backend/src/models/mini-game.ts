export enum MiniGameType {
  GENERAL_KNOWLEDGE = 'general-knowledge',
}

export class PublicState {
  players: string[];

  constructor(hostNickname) {
    this.players = [hostNickname];
  }
}

export class GameState<T extends PublicState> {
  public: T;

  constructor(publicState: T) {
    this.public = publicState;
  }
}

export class MiniGameRoom {
  code: string;
  miniGameType: MiniGameType;
  state: GameState<any>;

  constructor(code: string, miniGameType: MiniGameType, state: GameState<any>) {
    this.code = code;
    this.miniGameType = miniGameType;
    this.state = state;
  }
}
