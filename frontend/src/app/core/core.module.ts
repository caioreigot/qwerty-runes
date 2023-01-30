import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GeneralKnowledgeBoardComponent } from './components/general-knowledge-board/general-knowledge-board.component';
import { PlayerScoreCardComponent } from './components/player-score-card/player-score-card.component';

@NgModule({
  declarations: [
    GameCardComponent,
    GeneralKnowledgeBoardComponent,
    PlayerScoreCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GameCardComponent,
    GeneralKnowledgeBoardComponent,
    PlayerScoreCardComponent
  ]
})
export class CoreModule {}
