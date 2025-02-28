import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ProductsComponent } from '../components/products/products.component';
import { InvoicesComponent } from '../components/invoices/invoices.component';
//import { UsersComponent } from '../components/users/';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../components/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'users', component: UsersComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeModule {}