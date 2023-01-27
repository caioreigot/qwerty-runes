import { BackendService } from './../../shared/services/backend.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { SnackbarService } from './../../shared/services/snackbar.service';
import { Component, ElementRef, isDevMode, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  @ViewChild('loadingModal') loadingModal: ElementRef | null = null;
  @ViewChild('rememberCheckbox') rememberCheckbox: ElementRef | null = null;

  nickname = '';
  password = '';

  constructor(
    private snackbarService: SnackbarService,
    private localStorageService: LocalStorageService,
    private backendService: BackendService,
    private route: Router
  ) {
    // Se estiver com um token ainda não expirado, logue diretamente
    this.backendService.useTokenToValidateAuthentication().subscribe({
      error: () => this.loadingModal?.nativeElement.remove(),
      complete: () => this.route.navigate(['/games'])
    });
  }

  onLogin() {
    const rememberCheckbox = this.rememberCheckbox?.nativeElement as HTMLInputElement;
    const rememberAccount = rememberCheckbox.checked;

    if (!this.nickname || !this.password) {
      this.snackbarService.showMessage('Por favor, preencha todos os campos.', true);
      return;
    }

    this.backendService.login(this.nickname, this.password, rememberAccount)
      .subscribe({
        error: (errorResponse: HttpErrorResponse) => {
          const message = errorResponse.error.message instanceof Array 
            ? errorResponse.error.message[0]
            : errorResponse.error.message
  
          this.snackbarService.showMessage(message, true);
        },
        next: (response: any) => {
          const token = response.access_token;
          this.localStorageService.setToken(token);
          this.route.navigate(['/games']);
        }
      })
  }
}