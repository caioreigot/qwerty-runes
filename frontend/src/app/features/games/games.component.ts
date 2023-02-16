import { BackendService } from '../../shared/services/backend.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.less']
})
export class GamesComponent implements OnInit {

  private _isUserAdmin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isUserAdmin: Observable<boolean> = this._isUserAdmin.asObservable();
  
  constructor(
    private socket: Socket,
    private localStorageService: LocalStorageService,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit() {
    this.backendService.isUserAdmin().subscribe({
      error: () => this._isUserAdmin.next(false),
      complete: () => this._isUserAdmin.next(true)
    });
  }

  get nickname() {
    return this.localStorageService.getUserNickname() || '';
  }

  logout() {
    this.socket.emit('exit', this.localStorageService.getUserNickname());
    this.localStorageService.clearToken();
    this.router.navigate(['/']);
  }
}
