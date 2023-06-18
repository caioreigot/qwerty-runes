export class ScoreboardItem {
  
  nickname: string;
  score: number;
  isReady: boolean;
  lastGuess: string;

  constructor(nickname: string) {
    this.nickname = nickname;
    this.score = 0;
    this.isReady = false;
    this.lastGuess = '';
  }
}
