import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from './components/game-card/game-card.component';
import { PlayerScoreCardComponent } from './components/player-score-card/player-score-card.component';

@NgModule({
  declarations: [
    GameCardComponent,
    PlayerScoreCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GameCardComponent,
    PlayerScoreCardComponent
  ]
})
export class CoreModule {}
