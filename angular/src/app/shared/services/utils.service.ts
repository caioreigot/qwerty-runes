import { Injectable, isDevMode } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UtilsService {

  private _backendBaseUrl = '';

  get backendBaseUrl(): string {
    return isDevMode() ? 'http://localhost:3000/' : '/';
  }
}