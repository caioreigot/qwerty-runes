export enum MiniGameType {
  GENERAL_KNOWLEDGE = 'general-knowledge',
}

export interface Player {
  nickname: string;
  socketId: string;
}

/* Cada mini-jogo tem seu próprio state público (aquilo que é passado para o front-end
para que ele possa renderizar as informações na tela), o resto fica apenas do lado do servidor

Cada mini-jogo (GameState) terá seu próprio PublicState, portanto, é necessário criar uma nova
classe e extender a PublicState para então criar o GameState */
export abstract class PublicState {
  players: Player[];
  gameStarted = false;

  abstract disconnectPlayer(player: Player);
  abstract toggleReady(player: Player);
  abstract onPlayerJoin(player: Player);

  constructor(hostNickname, hostSocketId) {
    this.players = [{ nickname: hostNickname, socketId: hostSocketId }];
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
  state: GameState<PublicState>;

  constructor(code: string, miniGameType: MiniGameType, state: GameState<any>) {
    this.code = code;
    this.miniGameType = miniGameType;
    this.state = state;
  }
}
