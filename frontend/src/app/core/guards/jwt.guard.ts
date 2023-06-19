import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BackendService } from '../../shared/services/backend.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class JwtGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private backendService: BackendService,
    private localStorageService: LocalStorageService
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
        next: (response: any) => {
          const token = response?.access_token;
          
          // troca o token atualmente armazenado pelo mais recente fornecido
          if (token) {
            this.localStorageService.setToken(token);
          }

          this.onComplete(observer)
        },
        error: () => this.onError(observer)
      });
    })
  }
}