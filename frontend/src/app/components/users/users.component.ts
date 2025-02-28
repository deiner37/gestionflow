import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: User = { name: '', email: '', password: '', role: 'user' };
  selectedUser: User | null = null;
  errorMessage: string = '';

  constructor(
    private usersService: UsersService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    if (this.authService.isAdmin()) {
      this.usersService.getUsers().subscribe(
        (users) => {
          this.users = users;
        },
        (error) => {
          this.errorMessage = 'Error loading users: ' + (error.error?.message || error.message);
        }
      );
    } else {
      const userId = this.authService.getUserId();
      if (userId) {
        this.usersService.getUser(userId).subscribe(
          (user) => {
            this.users = [user];
          },
          (error) => {
            this.errorMessage = 'Error loading user profile: ' + (error.error?.message || error.message);
          }
        );
      }
    }
  }

  addUser() {
    if (this.authService.isAdmin()) {
      this.usersService.createUser(this.userForm).subscribe(
        (user) => {
          this.users.push(user);
          this.resetForm();
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error creating user: ' + (error.error?.message || error.message);
        }
      );
    } else {
      this.errorMessage = 'Only administrators can create users.';
    }
  }

  editUser(user: User) {
    if (this.authService.isAdmin() || (this.authService.getUserId() === user._id)) {
      this.selectedUser = { ...user };
      this.userForm = { ...user, password: '' };
    } else {
      this.errorMessage = 'You do not have permission to edit this user.';
    }
  }

  updateUser() {
    if (this.selectedUser && this.selectedUser._id) {
      if (this.authService.isAdmin() || (this.authService.getUserId() === this.selectedUser._id)) {
        this.usersService.updateUser(this.selectedUser._id, this.userForm).subscribe(
          (updatedUser) => {
            const index = this.users.findIndex(u => u._id === updatedUser._id);
            if (index !== -1) this.users[index] = updatedUser;
            this.resetForm();
            this.selectedUser = null;
            this.errorMessage = '';
          },
          (error) => {
            this.errorMessage = 'Error updating user: ' + (error.error?.message || error.message);
          }
        );
      } else {
        this.errorMessage = 'Only administrators or the user themselves can update this user.';
      }
    }
  }

  deleteUser(id: string) {
    if (this.authService.isAdmin() && confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe(
        () => {
          this.users = this.users.filter(u => u._id !== id);
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error deleting user: ' + (error.error?.message || error.message);
        }
      );
    } else {
      this.errorMessage = 'Only administrators can delete users.';
    }
  }

  cancelEdit() {
    this.selectedUser = null;
    this.resetForm();
  }

  private resetForm() {
    this.userForm = { name: '', email: '', password: '', role: 'user' };
  }
}