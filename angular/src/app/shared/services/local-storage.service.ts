import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  TOKEN_ID = 'jwt_token';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_ID, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_ID);
  }

  getUserInfo(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = window.atob(token.split(".")[1]);
    return JSON.parse(payload);
  }
}
