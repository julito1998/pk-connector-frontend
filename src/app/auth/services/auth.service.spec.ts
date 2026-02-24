import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: any;

  const mockUser: User = {
    id: '1',
    email: 'admin@empresa.com',
    name: 'Administrador',
    role: 'admin'
  };

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn()
    };
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    mockRouter = TestBed.inject(Router);

    // Clear localStorage and service state before each test
    localStorage.clear();
    service.logout(); // Reset service state
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return true for valid admin credentials', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('admin@empresa.com', 'admin123').subscribe(resolve);
      });
      expect(success).toBe(true);
    });

    it('should return true for valid user credentials', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('usuario@empresa.com', 'password').subscribe(resolve);
      });
      expect(success).toBe(true);
    });

    it('should return false for invalid email', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('invalid@email.com', 'password').subscribe(resolve);
      });
      expect(success).toBe(false);
    });

    it('should return false for invalid password', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('admin@empresa.com', 'wrongpassword').subscribe(resolve);
      });
      expect(success).toBe(false);
    });

    it('should store user in localStorage on successful login', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('admin@empresa.com', 'admin123').subscribe(resolve);
      });
      expect(success).toBe(true);
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      expect(storedUser).toEqual(mockUser);
    });

    it('should set isAuthenticated to true on successful login', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('admin@empresa.com', 'admin123').subscribe(resolve);
      });
      expect(success).toBe(true);
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Login first
      service.login('admin@empresa.com', 'admin123').subscribe();
    });

    it('should clear localStorage on logout', () => {
      service.logout();
      
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(localStorage.getItem('isAuthenticated')).toBeNull();
    });

    it('should set isAuthenticated to false on logout', () => {
      service.logout();
      
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should navigate to login on logout', () => {
      service.logout();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return current user when logged in', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('admin@empresa.com', 'admin123').subscribe(resolve);
      });
      expect(success).toBe(true);
      expect(service.getCurrentUser()).toEqual(mockUser);
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when not logged in', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true when logged in', async () => {
      const success = await new Promise<boolean>(resolve => {
        service.login('admin@empresa.com', 'admin123').subscribe(resolve);
      });
      expect(success).toBe(true);
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('checkAuthStatus', () => {
    it('should restore user session from localStorage', () => {
      // Simulate stored session
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Create new service instance to trigger checkAuthStatus
      const newService = new AuthService(mockRouter);
      
      expect(newService.getCurrentUser()).toEqual(mockUser);
      expect(newService.isLoggedIn()).toBe(true);
    });

    it('should not restore session if localStorage is empty', () => {
      const newService = new AuthService(mockRouter);
      
      expect(newService.getCurrentUser()).toBeNull();
      expect(newService.isLoggedIn()).toBe(false);
    });
  });
});
