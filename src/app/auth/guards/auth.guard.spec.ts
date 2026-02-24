import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let router: any;
  let mockRoute: any;
  let mockState: any;

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn()
    } as any;

    router = {
      navigate: vi.fn()
    };

    mockRoute = {};
    mockState = { url: '/protected-route' };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should allow access when user is authenticated', () => {
    authService.isLoggedIn = vi.fn().mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => {
      return authGuard(mockRoute, mockState);
    });

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authService.isLoggedIn = vi.fn().mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => {
      return authGuard(mockRoute, mockState);
    });

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/protected-route' }
    });
  });

  it('should handle empty URL in returnUrl', () => {
    authService.isLoggedIn = vi.fn().mockReturnValue(false);
    mockState.url = '';

    const result = TestBed.runInInjectionContext(() => {
      return authGuard(mockRoute, mockState);
    });

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '' }
    });
  });

  it('should handle root path in returnUrl', () => {
    authService.isLoggedIn = vi.fn().mockReturnValue(false);
    mockState.url = '/';

    const result = TestBed.runInInjectionContext(() => {
      return authGuard(mockRoute, mockState);
    });

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/' }
    });
  });
});
