export enum MiniGameType {
  GENERAL_KNOWLEDGE = 'general-knowledge',
}

/* Cada mini-jogo tem seu próprio state público (aquilo que é passado para o front-end
para que ele possa renderizar as informações na tela), o resto fica apenas do lado do servidor

Cada mini-jogo terá seu próprio PublicState, portanto, é necessário criar uma nova classe
e extendar a PublicState para então criar o GameState */
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
