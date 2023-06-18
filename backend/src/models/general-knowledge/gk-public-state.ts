import { Player } from '../player';
import { PublicState } from '../public-state';
import { Board } from './board';
import { Scoreboard } from './scoreboard';
import { ScoreboardItem } from './scoreboard-item';

export class GeneralKnowledgeGamePublicState extends PublicState {
  
  playersAnsweredCorrectly: string[] = [];
  correctAnswer: string | null;
  scoreboard: Scoreboard[] = [];
  timerInSeconds = 12;
  board: Board | null = null;

  onPlayerJoin(player: Player) {
    this.players.push(player);
    this.scoreboard.push(new ScoreboardItem(player.nickname));
  }

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
