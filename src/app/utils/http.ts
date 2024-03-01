import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private apiUrl: string = environment.apiUrl;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiReq = req.clone({
      url: `${this.apiUrl}/${req.url}`,
    });
    return next.handle(apiReq);
  }
}
