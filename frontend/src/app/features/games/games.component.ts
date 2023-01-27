import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.less']
})
export class GamesComponent {
  
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  get nickname() {
    return this.localStorageService.getUserNickname() || '';
  }

  logout() {
    this.localStorageService.clearToken();
    this.router.navigate(['/']);
  }
}
