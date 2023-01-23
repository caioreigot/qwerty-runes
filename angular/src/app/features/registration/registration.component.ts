import { UtilsService } from './../../shared/services/utils.service';
import { SnackbarService } from './../../shared/services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { isDevMode } from '@angular/core';
import { catchError, of } from 'rxjs';

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
    private http: HttpClient,
    private utilsService: UtilsService,
    private snackbarService: SnackbarService
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.snackbarService.showMessage('As senhas não são iguais!', true);
      return;
    }

    const createUserEndpoint = this.utilsService.backendBaseUrl + 'user/create';

    const objectToPost = {
      nickname: this.nickname,
      password: this.password
    }

    this.http.post(createUserEndpoint, objectToPost)
      .pipe(catchError((errorResponse: HttpErrorResponse) => {
        const message = errorResponse.error.message instanceof Array 
          ? errorResponse.error.message[0]
          : errorResponse.error.message

        this.snackbarService.showMessage(message, true);
        return of();
      }))
      .subscribe(() => {
        this.snackbarService.showMessage('Conta criada com sucesso!');
        this.clearForm();
      })
  }

  private clearForm() {
    this.nickname = '';
    this.password = '';
    this.confirmPassword = '';
  }
}