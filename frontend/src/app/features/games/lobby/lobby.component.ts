import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {

  constructor(
    private socket: Socket,
    private snackbarService: SnackbarService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.socket.fromEvent('error').subscribe((errorMessage: any) => {
      this.snackbarService.showMessage(errorMessage, true);
    });
  }

  enterRoom(roomCode: string) {
    this.socket.fromEvent('entered-room').subscribe(() => {
      this.router.navigate(['general-knowledge'], { 
        relativeTo: this.route,
        queryParams: { room: roomCode } 
      });
    });

    const nickname = this.localStorageService.getUserNickname();
    this.socket.emit('enter-room', { nickname, roomCode });
  }
}
