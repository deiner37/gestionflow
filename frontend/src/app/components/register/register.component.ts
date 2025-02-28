import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '', role: 'user' };
  errorMessage: string = '';

  constructor(private usersService: UsersService, private router: Router) {}

  register() {
    this.usersService.register(this.user).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.errorMessage = 'Registration error. Please check the data or try again.';
      }
    );
  }
}