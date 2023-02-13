import { Observable, of, tap, catchError, Subscriber } from 'rxjs';
import { BackendService } from './../../shared/services/backend.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GamesGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private backendService: BackendService
  ) {}

  onError(observer: Subscriber<boolean>) {
    observer.next(false);
    this.router.navigate(['/']);
  }

  onComplete(observer: Subscriber<boolean>) {
    observer.next(true);
  }

  canActivate() {
    return new Observable<boolean>((observer) => {
      this.backendService.useTokenToValidateAuthentication().subscribe({
        error: () => this.onError(observer),
        complete: () => this.onComplete(observer)
      });
    })
  }
}