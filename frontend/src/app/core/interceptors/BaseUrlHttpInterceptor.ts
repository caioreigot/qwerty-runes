import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

export class BaseUrlHttpInterceptor implements HttpInterceptor {

  backendBaseUrl = isDevMode() ? 'http://localhost:3000' : '';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiRequest = request.clone({ url: `${this.backendBaseUrl}/${request.url}` });
    return next.handle(apiRequest);
  }
}