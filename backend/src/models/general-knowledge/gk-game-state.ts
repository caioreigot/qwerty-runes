import { GameState } from '../game-state';
import { GeneralKnowledgeGamePublicState } from './gk-public-state';
import { ScoreboardItem } from './scoreboard-item';

type Confirmation = {
  questionId: number;
  confirmedSocketIds: string[];
};

export class GeneralKnowledgeGameState extends GameState<GeneralKnowledgeGamePublicState> {
  
  timeInSecondsToAnswer = 12;
  boardQuestionsIdQueue: number[] = [];
  receiptConfirmations: Confirmation[] = [];
  currentAcceptableAnswers: string;

  resetTimer() {
    this.public.timerInSeconds = this.timeInSecondsToAnswer;
  }

  constructor(hostNickname: string, hostSocketId: string) {
    super(new GeneralKnowledgeGamePublicState(hostNickname, hostSocketId));
    this.public.scoreboard.push(new ScoreboardItem(hostNickname));
  }
}
