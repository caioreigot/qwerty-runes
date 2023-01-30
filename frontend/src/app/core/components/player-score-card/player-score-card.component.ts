import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-score-card',
  templateUrl: './player-score-card.component.html',
  styleUrls: ['./player-score-card.component.less']
})
export class PlayerScoreCardComponent {
  
  @Input() score = 0;
  @Input() nickname = 'Desconhecido';
}