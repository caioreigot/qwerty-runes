import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-general-knowledge',
  templateUrl: './general-knowledge.component.html',
  styleUrls: ['./general-knowledge.component.less']
})
export class GeneralKnowledgeComponent {

  roomCode: string = '';
  participants: string[] = [
    this.localStorageService.getUserNickname() ?? ''
  ];
  
  constructor(
    private socket: Socket,
    private localStorageService: LocalStorageService
  ) {
    this.subscribeToSocketEvents();
    
    const miniGameType = window.location.href.split("/").pop();
    this.socket.emit('create-room', miniGameType);
  }

  subscribeToSocketEvents() {
    this.socket.fromEvent('room-code').subscribe((roomCode: any) => {
      this.roomCode = roomCode;
    });

    this.socket.fromEvent('user-entered-room').subscribe((nickname: any) => {
      this.participants.push(nickname);
    });
  }
}
