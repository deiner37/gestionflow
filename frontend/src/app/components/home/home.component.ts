import { Component, HostListener, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	authService = inject(AuthService);
	router = inject(Router);
	cartSubscription?: Subscription;
	cartItemCount: number = 0;
	badgeClass: string = '';

  constructor(private cartService: CartService) {}

	ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      const newCount = items.reduce((total, item) => total + 1, 0);
      if (newCount !== this.cartItemCount) {
        this.badgeClass = 'updated'; // Añade la clase para la animación
      }
      this.cartItemCount = newCount;
    });
  }

	ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}