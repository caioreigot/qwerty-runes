import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private TOKEN_ID = 'jwt_token';

  setToken(token: string): void {
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

    const payload: Payload = jwt_decode(token);
    return payload.nickname;
  }
}
