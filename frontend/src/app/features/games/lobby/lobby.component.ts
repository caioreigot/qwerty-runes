import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent {

  constructor(
    private socket: Socket,
    private snackbarService: SnackbarService,
    private localStorageService: LocalStorageService
  ) {
    this.socket.fromEvent('error').subscribe((errorMessage: any) => {
      this.snackbarService.showMessage(errorMessage, true);
    });
  }

  enterRoom(roomCode: string) {
    const nickname = this.localStorageService.getUserNickname();
    this.socket.emit('enter-room', { nickname, roomCode });
  }
}
