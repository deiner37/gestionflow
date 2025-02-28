import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate de que AuthService esté creado
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
		let modifiedRequest = request;
    if (token) {
      modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(modifiedRequest).pipe(
      catchError((error) => {
        if (error.toString().includes('401')) {
          console.log('Token inválido o expirado, cerrando sesión...');
          this.authService.logout(); 
          this.router.navigate(['/login']);
          return throwError(() => new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
        }
        return throwError(() => error);
      })
    );
  }
}