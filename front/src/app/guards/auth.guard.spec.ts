import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthGuard } from './auth.guard';
import { expect } from '@jest/globals';
describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerMock: { navigate: jest.Mock };
  let sessionServiceMock: { isLogged: boolean };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    sessionServiceMock = { isLogged: false };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
  });

  it('should redirect an unauthenticated user to the login page', () => {
    sessionServiceMock.isLogged = false;
    const result = authGuard.canActivate();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should allow the navigation for an authenticated user', () => {
    sessionServiceMock.isLogged = true;
    const result = authGuard.canActivate();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
