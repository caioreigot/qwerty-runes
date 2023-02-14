import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.less']
})
export class GamesComponent {
  
  constructor(
    private socket: Socket,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  get nickname() {
    return this.localStorageService.getUserNickname() || '';
  }

  logout() {
    this.socket.emit('exit', this.localStorageService.getUserNickname());
    this.localStorageService.clearToken();
    this.router.navigate(['/']);
  }
}
