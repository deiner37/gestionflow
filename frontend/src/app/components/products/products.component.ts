import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productForm: Product = { name: '', description: '', price: 0, stock: 0, status: 'active' };
  selectedProduct: Product | null = null;
  errorMessage: string = '';
	authService = inject(AuthService);
	quantities: { [key: string]: number } = {};
	
	Math = Math;

  constructor(private productsService: ProductsService, private cartService: CartService, private toastr: ToastrService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe((products: Product[]) => {
        this.products = products;
				this.products.forEach(product => {
					this.quantities[product._id || 0] = 1;
					let pincart = this.getFromCart(product);
					if(pincart){
						product.stock = product.stock - pincart.quantity;
					}
				});
      },
      (error: any) => {
        this.errorMessage = 'Error: ' + error.message;
      }
    );
  }

	private getFromCart(product: Product){
		const me = this;
		return me.cartService.getProduct(product);
	}

  addProduct() {
    this.productsService.createProduct(this.productForm).subscribe(
      (product: Product) => {
        this.products.push(product);
        this.resetForm();
        this.errorMessage = '';
      },
      (error: any) => {
        this.errorMessage = 'Error: ' + error.message;
      }
    );
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.productForm = { ...product };
  }

  updateProduct() {
		if (this.selectedProduct && this.selectedProduct._id) {
      this.productsService.updateProduct(this.selectedProduct._id, this.productForm).subscribe(
				(updatedProduct: Product) => {
          const index = this.products.findIndex(p => p._id === updatedProduct._id);
          if (index !== -1) this.products[index] = updatedProduct;
          this.resetForm();
          this.selectedProduct = null;
          this.errorMessage = '';
        },
        (error: any) => {
          this.errorMessage = 'Error: ' + error.message;
        }
      );
    }
  }

  deleteProduct(id: string) {
    if (confirm('¿Are you sure?')) { 
      this.productsService.deleteProduct(id).subscribe(
        () => {
          this.products = this.products.filter(p => p._id !== id);
          this.errorMessage = '';
        },
        (error: any) => {
          this.errorMessage = 'Error: ' + error.message;
        }
      );
    }
  }

  cancelEdit() {
    this.selectedProduct = null;
    this.resetForm();
  }

  private resetForm() {
    this.productForm = { name: '', description: '', price: 0, stock: 0, status: 'active' };
  }

	addToCart(product: any): void {
    const quantity = this.quantities[product._id] || 1;
    if (quantity > product.stock) {
      this.toastr.error(`Cannot add ${quantity} ${product.name}(s). Only ${product.stock} in stock.`);
      return;
    }
    if (quantity <= 0) {
      this.toastr.error('Please select a quantity greater than 0.');
      return;
    }
    this.cartService.addToCart(product, quantity);
    this.toastr.success(`${quantity} ${product.name}(s) added to cart!`); // Reemplaza con una notificación más elegante
    this.quantities[product._id] = 1
		product.stock = product.stock - quantity;
  }

  isAddToCartDisabled(product: any): boolean {
    const quantity = this.quantities[product._id] || 1;
    return product.stock <= 0 || quantity <= 0 || quantity > product.stock;
  }

	updateQuantity(product: any, quantity: number): void {
		if(product.stock < quantity){
			this.toastr.error(`Cannot add ${quantity} ${product.name}(s). Only ${product.stock} in stock.`);
			setTimeout(() => {
				this.quantities[product._id] = product.stock; // Asegura que el input se actualice
			});
			return;
		}
    const minValue = Math.min(product.stock, quantity);
    const maxValue = Math.max(1, minValue);
    this.quantities[product._id] = maxValue;
  }
}