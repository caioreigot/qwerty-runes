import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.less']
})
export class GameCardComponent {
  
  @Input() icon: string = '';
  @Input() game: string = '';
}
