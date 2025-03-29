import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  addToCart(product: any, quantity: number = 1) {
    const existingItem = this.cartItems.find(item => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity,
        stock: product.stock, // Almacena el stock del producto
      });
    }
    this.updateCart();
  }

  removeFromCart(productId: string) {
    this.cartItems = this.cartItems.filter(item => item._id !== productId);
    this.updateCart();
  }

  updateQuantity(product: CartItem) {
    const item = this.cartItems.find(item => item._id === product._id);
    if (item) {
      item.quantity = product.quantity;
      item.stock = product.stock; // Actualiza el stock si es necesario
      if (item.quantity <= 0) {
        this.removeFromCart(product._id);
      } else {
        this.updateCart();
      }
    }
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

	getProduct(product: Product): CartItem | undefined{
		let items = this.getCartItems();
		return items.find(item => item._id === product._id);
	}

  private updateCart() {
    this.cartItemsSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}