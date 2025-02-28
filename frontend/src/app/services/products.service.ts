import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model'; 

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private api: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('/products');
  }

  getProduct(id: string): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

	createProduct(product: Product): Observable<Product> {
    return this.api.post<Product>(`/products`, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete<void>(`/products/${id}`);
  }
}