import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  role: string; // Añade la propiedad role que esperas en tu token JWT
}

interface UserData {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  token$: Observable<string | null> = this.tokenSubject.asObservable();

  constructor() {
    this.token$.subscribe(token => {
      if (!token) localStorage.removeItem('token');
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

	setUserData(userData: UserData) {
    localStorage.setItem('userData', JSON.stringify(userData)); // Persist for reloads
  }

  getUserData(): UserData | null {
    const storedData = localStorage.getItem('userData');
		if(storedData)
    	return JSON.parse(storedData);
		return null
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return decoded.role;
    }
    return null;
  }

  isAdmin(): boolean {
		return this.getRole() === 'admin';
	}

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

	getUserId(): string | null {
    const userData = this.getUserData();
    if (userData) {
      return userData.id;
    }
    return null;
  }
}