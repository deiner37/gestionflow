import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Make sure to include RouterLink
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.usersService.login(this.email, this.password).subscribe(
      (response: any) => {
        this.authService.setToken(response.access_token);
				this.authService.setUserData(response.user);
        this.router.navigate(['/home'], {
          replaceUrl: true 
        }).then(() => {
          //console.log('Navigation to /home completed');
        }).catch(err => {
          console.error('Navigation error:', err);
        });
      },
      (error: any) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Login error:', error);
      }
    );
  }
}