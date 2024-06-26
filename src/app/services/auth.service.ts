/*import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Usuário e senha fixos no código.
    const username = 'boliveira';
    const password = 'boliveira';

    // Codificar o nome de usuário e senha em base64
    const base64Credentials = btoa(`${username}:${password}`);

    // Clonar a requisição original e adicionar o cabeçalho de autorização
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    // Prosseguir com a requisição modificada
    return next.handle(modifiedRequest);
  }
}*/
