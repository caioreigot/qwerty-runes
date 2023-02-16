import { BackendService } from '../../shared/services/backend.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private backendService: BackendService
  ) {}

  onError(observer: Subscriber<boolean>) {
    observer.next(false);
    this.router.navigate(['/']);
  }
  
  canActivate() {
    return new Observable<boolean>((observer) => {
      this.backendService.isUserAdmin().subscribe({
        error: () => this.onError(observer),
        complete: () => observer.next(true)
      });
    })
  }
}