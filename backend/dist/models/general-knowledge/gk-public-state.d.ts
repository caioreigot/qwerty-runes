import { Player } from '../player';
import { PublicState } from '../public-state';
import { Board } from './board';
import { Scoreboard } from './scoreboard';
export declare class GeneralKnowledgeGamePublicState extends PublicState {
    playersAnsweredCorrectly: string[];
    correctAnswer: string | null;
    scoreboard: Scoreboard[];
    timerInSeconds: number;
    board: Board | null;
    onPlayerJoin(player: Player): void;
    toggleReady(player: Player): void;
    disconnectPlayer(player: Player): void;
}
