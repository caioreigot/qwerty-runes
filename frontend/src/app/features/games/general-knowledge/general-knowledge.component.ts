import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

interface GeneralKnowledgeState {
  scoreboard: { nickname: string, score: number }[]
}

@Component({
  selector: 'app-general-knowledge',
  templateUrl: './general-knowledge.component.html',
  styleUrls: ['./general-knowledge.component.less']
})
export class GeneralKnowledgeComponent {

  roomCode: string = '';
  gameState: GeneralKnowledgeState = {
    scoreboard: []
  }
  
  constructor(
    private socket: Socket,
    private localStorageService: LocalStorageService
  ) {
    this.subscribeToSocketEvents();
    
    const miniGameType = window.location.href.split("/").pop();
    this.socket.emit('create-room', {
      nickname: this.localStorageService.getUserNickname(), miniGameType
    });
  }

  subscribeToSocketEvents() {
    this.socket.fromEvent('room-code').subscribe((roomCode: any) => {
      this.roomCode = roomCode;
    });

    this.socket.fromEvent('state-changed').subscribe((newState: any) => {
      this.gameState = newState;
    });
  }
}
