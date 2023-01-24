import { Observable, of, tap, catchError } from 'rxjs';
import { BackendService } from './../../shared/services/backend.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GamesGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private backendService: BackendService
  ) {}

  canActivate() {
    return new Observable<boolean>((observer) => {
      this.backendService.useTokenToValidateAuthentication()
        .pipe(catchError(() => {
          observer.next(false);
          this.router.navigate(['/']);
          return of();
        }))
        .subscribe(() => observer.next(true));
    })
  }
}