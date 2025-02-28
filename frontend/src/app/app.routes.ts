import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const authGuard = () => {
  const authService = new AuthService();
  return authService.isAuthenticated();
};

export const routes: Routes = [
	{
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'home',
		canActivate: [authGuard],
		canActivateChild: [authGuard], 
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
];