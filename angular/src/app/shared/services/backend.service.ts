import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class BackendService {
  
  endpoints = {
    user: {
      login: 'user/login',
      loginWithToken: 'user/login-with-token',
      create: 'user/create'
    }
  } 

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  createUser(nickname: string, password: string) {
    const body = { nickname, password };
    return this.http.post(this.endpoints.user.create, body);
  }

  login(nickname: string, password: string) {
    const body = { nickname, password };
    return this.http.post(this.endpoints.user.login, body);
  }

  useTokenToValidateAuthentication(): Observable<void | HttpErrorResponse> {
    const token = this.localStorageService.getToken() || '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<void | HttpErrorResponse>(
      this.endpoints.user.loginWithToken, { headers }
    );
  }
}
