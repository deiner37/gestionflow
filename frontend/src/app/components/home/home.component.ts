import { Component, HostListener, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor() {}

	ngOnInit(): void {
    const me = this;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}