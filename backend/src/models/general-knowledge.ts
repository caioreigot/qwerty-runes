import { GameState, Player, PublicState } from './mini-game';

export enum GeneralKnowledgeQuestionType {
  IMAGE = 'image',
  TEXT = 'text',
}

class Scoreboard {
  nickname: string;
  score: number;
}

export class GeneralKnowledgeGamePublicState extends PublicState {
  scoreboard: Scoreboard[] = [];

  disconnectPlayer(player: Player) {
    const playerLeavingIndex = this.players.findIndex(
      (currentPlayer) => currentPlayer.socketId === player.socketId,
    );

    const scoreboardItemToRemoveIndex = this.scoreboard.findIndex(
      (scoreboardItem) => scoreboardItem.nickname === player.nickname,
    );

    this.players.splice(playerLeavingIndex, 1);
    this.scoreboard.splice(scoreboardItemToRemoveIndex, 1);
  }
}

export class GeneralKnowledgeGameState extends GameState<GeneralKnowledgeGamePublicState> {
  isImage: boolean;
  boardContent: string;
  correctAnswers: string;

  constructor(hostNickname: string, hostSocketId: string) {
    super(new GeneralKnowledgeGamePublicState(hostNickname, hostSocketId));
    this.public.scoreboard.push({
      nickname: hostNickname,
      score: 0,
    });
  }
}
