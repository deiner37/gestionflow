import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private api: ApiService) {}

  login(email: string, password: string): Observable<any> {
    return this.api.post('/auth/login', { email, password });
  }

  register(user: User): Observable<any> {
    return this.api.post('/auth/register', user);
  }

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getUser(id: string): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.api.post<User>('/users', user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.api.put<User>(`/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }
}