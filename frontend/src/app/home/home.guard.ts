import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true; // Permite el acceso si es admin
    } else {
      this.router.navigate(['/home/products']); // Redirige a /invoices si no es admin
      return false;
    }
  }
}