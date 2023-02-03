import { GameState, PublicState } from './mini-game';

class Scoreboard {
  nickname: string;
  score: number;
}

export class GeneralKnowledgeGamePublicState extends PublicState {
  scoreboard: Scoreboard[] = [];
}

export class GeneralKnowledgeGameState extends GameState<GeneralKnowledgeGamePublicState> {
  isImage: boolean;
  boardContent: string;
  correctAnswers: string;

  constructor(hostNickname: string) {
    super(new GeneralKnowledgeGamePublicState(hostNickname));
    this.public.scoreboard.push({
      nickname: hostNickname,
      score: 0,
    });
  }
}
