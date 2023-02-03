import { BackendService } from './../../shared/services/backend.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private backendService: BackendService
  ) {}
  
  canActivate() {
    return new Observable<boolean>((observer) => {
      this.backendService.isUserAdmin()
        .pipe(catchError(() => {
          observer.next(false);
          this.router.navigate(['/']);
          return of();
        }))
        .subscribe((isAdmin) => {
          observer.next(isAdmin);
          if (!isAdmin) this.router.navigate(['/']);
        });
    })
  }
}