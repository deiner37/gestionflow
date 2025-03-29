import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ProductsComponent } from '../components/products/products.component';
import { InvoicesComponent } from '../components/invoices/invoices.component';
//import { UsersComponent } from '../components/users/';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../components/users/users.component';
import { HomeGuard } from './home.guard';
import { CartComponent } from '../components/cart/cart.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { 
				path: '', 
				component: DashboardComponent,
				canActivate: [HomeGuard], 
			},
      { path: 'products', component: ProductsComponent },
      { 
				path: 'invoices', 
				component: InvoicesComponent
			},
      { 
				path: 'users', 
				component: UsersComponent,
				canActivate: [HomeGuard], 
			},
			{ path: 'cart', component: CartComponent }
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeModule {}