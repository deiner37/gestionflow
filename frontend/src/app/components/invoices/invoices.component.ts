import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice, InvoiceProduct } from '../../models/invoice.model';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  invoiceForm: Invoice = { userId: '', username: '',products: [], total: 0, date: new Date() };
  selectedInvoice: Invoice | null = null;
  errorMessage: string = '';
	products: Product[] = [];

  constructor(
    private invoicesService: InvoicesService,
    public authService: AuthService,
		private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.loadInvoices();
		this.loadProducts();
  }

	loadProducts() {
    this.productsService.getProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        this.errorMessage = 'Error loading products: ' + error.message;
      }
    );
  }

  loadInvoices() {
    if (this.authService.isAdmin()) {
      this.invoicesService.getInvoices().subscribe((invoices: Invoice[]) => {
          this.invoices = invoices;
        },(error: any) => {
          this.errorMessage = 'Error loading invoices: ' + error.message;
        }
      );
    } else {
			const userId = this.authService.getUserId();
			if(userId){
				this.invoicesService.getInvoicesForUser(userId).subscribe(
					(invoices: Invoice[]) => {
						this.invoices = invoices;
					},
					(error: any) => {
						this.errorMessage = 'Error loading invoices: ' + error.message;
					}
				);
			}
    }
  }

  addInvoice() {
    if (!this.authService.isAdmin()) { // Only regular users can create invoices
			const user=  this.authService.getUserData();
			if(!user) throw 'User not found';
      this.invoiceForm.userId = user.id;
      this.invoiceForm.username = user.name;
      this.invoicesService.createInvoice(this.invoiceForm).subscribe(
        (invoice) => {
          this.invoices.push(invoice);
          this.resetForm();
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error creating invoice: ' + error.message;
        }
      );
    } else {
      this.errorMessage = 'Administrators cannot create invoices directly.';
    }
  }

  editInvoice(invoice: Invoice) {
    this.selectedInvoice = { ...invoice };
    this.invoiceForm = { ...invoice };
  }

  deleteInvoice(id: string) {
    if (this.authService.isAdmin()) {
			if(confirm('Are you sure you want to delete this invoice?')){
				this.invoicesService.deleteInvoice(id).subscribe(
					() => {
						this.invoices = this.invoices.filter(i => i._id !== id);
						this.errorMessage = '';
					},
					(error) => {
						this.errorMessage = 'Error deleting invoice: ' + error.message;
					}
				);
			}
    } else {
      this.errorMessage = 'Only administrators can delete invoices.';
    }
  }


  addProductToInvoice() {
    if (!this.invoiceForm.products) {
      this.invoiceForm.products = [];
    }
    this.invoiceForm.products.push({ productId: '', quantity: 0, price: 0, name: '' });
  }

  removeProductFromInvoice(index: number) {
    if (this.invoiceForm.products && this.invoiceForm.products.length > 1) {
      this.invoiceForm.products.splice(index, 1);
    }
  }

  private resetForm() {
    this.invoiceForm = { userId: '', username: '',products: [], total: 0, date: new Date() };
  }

	calculateTotal(products: InvoiceProduct[]): number {
    return products.reduce((sum, item) => {
      // This would typically fetch product prices from the backend, but for now, assume total is calculated there
      return sum + (item.quantity * item.price);
    }, 0);
  }

  calculateTotalQuantity(products: { quantity: number }[]): number {
    return products ? products.reduce((sum, p) => sum + (p.quantity || 0), 0) : 0;
  }
}