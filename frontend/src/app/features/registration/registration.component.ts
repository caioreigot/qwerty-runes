import { BackendService } from './../../shared/services/backend.service';
import { SnackbarService } from './../../shared/services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent {

  nickname: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private backendService: BackendService
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.snackbarService.showMessage('As senhas não são iguais!', true);
      return;
    }

    this.backendService.createUser(this.nickname, this.password).subscribe({
      error: (errorResponse: HttpErrorResponse) => {
        const message = errorResponse.error.message instanceof Array 
          ? errorResponse.error.message[0]
          : errorResponse.error.message
  
        this.snackbarService.showMessage(message, true);
      },
      next: () => {
        this.snackbarService.showMessage('Conta criada com sucesso!');
        this.router.navigate(['/']);
        this.clearForm();
      }
    });
  }

  private clearForm() {
    this.nickname = '';
    this.password = '';
    this.confirmPassword = '';
  }
}