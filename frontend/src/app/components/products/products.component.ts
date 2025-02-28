import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

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

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe((products: Product[]) => {
        this.products = products;
      },
      (error: any) => {
        this.errorMessage = 'Error: ' + error.message;
      }
    );
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
}