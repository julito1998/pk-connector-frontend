import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // Mock users database
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@empresa.com',
      name: 'Administrador',
      role: 'admin'
    },
    {
      id: '2', 
      email: 'usuario@empresa.com',
      name: 'Usuario',
      role: 'user'
    }
  ];
  
  private mockPasswords: { [key: string]: string } = {
    'admin@empresa.com': 'admin123',
    'usuario@empresa.com': 'password'
  };

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  login(email: string, password: string): Observable<boolean> {
    const user = this.mockUsers.find(u => u.email === email);
    
    if (user && this.mockPasswords[email] === password) {
      // Store user session
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      
      return of(true);
    }
    
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    // Check BehaviorSubject first (for reactive updates)
    if (this.isAuthenticatedSubject.value) {
      return true;
    }
    
    // Fallback to localStorage check (for initial load)
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  }

  private checkAuthStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser && isAuth === 'true') {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      // Ensure BehaviorSubject is in correct state when localStorage is empty
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }
}
