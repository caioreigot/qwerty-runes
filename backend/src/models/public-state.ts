import { Player } from './player';

/* Cada mini-jogo tem seu próprio state público (aquilo que é passado
para o front-end para que ele possa renderizar as informações na tela),
o resto fica apenas do lado do servidor.
Cada mini-jogo (GameState) tem seu próprio PublicState, portanto,
é necessário criar uma nova classe e extender a PublicState,
para, então, criar o GameState */
export abstract class PublicState {
  
  players: Player[];
  gameStarted = false;

  abstract onPlayerJoin(player: Player): void;
  abstract toggleReady(player: Player): void;
  abstract disconnectPlayer(player: Player): void;

  constructor(hostNickname: string, hostSocketId: string) {
    this.players = [
      {
        nickname: hostNickname,
        socketId: hostSocketId,
      },
    ];
  }
}
