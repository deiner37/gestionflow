import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../../models/cart.model';
import { isNgTemplate } from '@angular/compiler';
import { AuthService } from '../../services/auth.service';
import { InvoicesService } from '../../services/invoices.service';
import Swal from 'sweetalert2';


@Component({
	selector: 'app-cart',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
	cartItems: any[] = [];

	constructor(
		private cartService: CartService,
		private authService: AuthService,
		private apiService: ApiService,
		private invoicesService: InvoicesService,
		private router: Router,
		private toastr: ToastrService
	) { }

	ngOnInit(): void {
		this.cartService.cartItems$.subscribe(items => {
			this.cartItems = items;
		});
	}

	removeFromCart(item: any): void {
		this.cartService.removeFromCart(item._id);
		this.toastr.success(`${item.name} removed from cart.`, 'Success');
	}

	checkout(): void {
		const me = this;
		if (me.cartItems.length === 0) {
			me.toastr.error('Your cart is empty. Add some products to checkout.', 'Error');
			return;
		}

		const userId = me.authService.getUserId();
		if (!userId) {
			me.toastr.error('User not authenticated. Please log in to checkout.', 'Error');
			me.router.navigate(['/login']);
			return;
		}

		Swal.fire({
			title: 'Confirm Purchase',
			text: 'Are you sure you want to complete your purchase?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, buy now!',
			cancelButtonText: 'No, cancel'
		}).then((result) => {
			if (result.isConfirmed) {
				const invoiceData = {
					products: me.cartItems.map(item => ({
						productId: item._id,
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					})),
				};

				me.apiService.post('/invoices', invoiceData).subscribe(
					(newInvoice) => {
						me.cartService.clearCart();
						me.toastr.success('Checkout successful! Your invoice has been created.', 'Success');
						me.router.navigate(['/home/invoices']);
					},
					(error) => {
						me.toastr.error('Error creating invoice. Please try again.', 'Error');
					}
				);
			}
		});


	}

	getTotal(): number {
		return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	updateQuantity(product: CartItem): void {
		if (product.stock < product.quantity) {
			this.toastr.error(`Cannot add ${product.quantity} ${product.name}(s). Only ${product.stock} in stock.`);
			setTimeout(() => {
				product.quantity = product.stock;
			});
			return;
		}
		const minValue = Math.min(product.stock, product.quantity);
		const maxValue = Math.max(1, minValue);
		product.quantity = maxValue;
		this.cartService.updateQuantity(product)
	}
}