import { SnackbarService } from './../../shared/services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from './../../shared/services/utils.service';
import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  nickname = '';
  password = '';

  constructor(
    private utilsService: UtilsService,
    private snackbarService: SnackbarService,
    private http: HttpClient
  ) {}

  onSubmit() {
    const validateUserEndpoint = this.utilsService.backendBaseUrl + 'user/validate';

    const objectToPost = {
      nickname: this.nickname,
      password: this.password
    }

    this.http.post<boolean>(validateUserEndpoint, objectToPost)
      .pipe(catchError((errorResponse: HttpErrorResponse) => {
        const message = errorResponse.error.message instanceof Array 
          ? errorResponse.error.message[0]
          : errorResponse.error.message

        this.snackbarService.showMessage(message, true);
        return of();
      }))
      .subscribe(() => {
        // Redirecionar para home
      })
  }
}