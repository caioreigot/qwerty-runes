import { GameState, Player, PublicState } from './mini-game';

export enum GeneralKnowledgeQuestionType {
  IMAGE = 'image',
  TEXT = 'text',
}

class Scoreboard {
  nickname: string;
  score: number;
  isReady: boolean;
  lastGuess: string;
}

class Board {
  id: number;
  questionTitle: string;
  type: GeneralKnowledgeQuestionType;
  content: string;
}

export class GeneralKnowledgeGamePublicState extends PublicState {
  scoreboard: Scoreboard[] = [];
  board: Board | null = null;

  toggleReady(player: Player) {
    const targetPlayer = this.scoreboard.find((scoreboardItem) => {
      return scoreboardItem.nickname === player.nickname;
    });

    targetPlayer.isReady = !targetPlayer.isReady;
  }

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

export class ScoreboardItem {
  nickname: string;
  score: number;
  isReady: boolean;
  lastGuess: string;

  constructor(nickname) {
    this.nickname = nickname;
    this.score = 0;
    this.isReady = false;
    this.lastGuess = '';
  }
}

export class GeneralKnowledgeGameState extends GameState<GeneralKnowledgeGamePublicState> {
  boardIdQueue: number[] = [];
  receiptConfirmations: { questionId: number; confirmedSocketIds: string[] }[] = [];
  currentCorrectAnswers: string;

  constructor(hostNickname: string, hostSocketId: string) {
    super(new GeneralKnowledgeGamePublicState(hostNickname, hostSocketId));
    this.public.scoreboard.push(new ScoreboardItem(hostNickname));
  }
}
