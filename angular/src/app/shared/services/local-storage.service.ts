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

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_ID);
  }

  getUserNickname(): string | null {
    const token = this.getToken();
    if (!token) return null;

    type Payload = {
      nickname: string,
      sub: number,
      iat: number,
      exp: number
    }

    const payload: Payload = JSON.parse(window.atob(token.split(".")[1]));
    return payload.nickname;
  }
}
