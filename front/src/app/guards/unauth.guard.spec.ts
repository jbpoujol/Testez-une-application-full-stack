import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { UnauthGuard } from './unauth.guard';

describe('UnauthGuard', () => {
  let unauthGuard: UnauthGuard;
  let routerMock: { navigate: jest.Mock };
  let sessionServiceMock: { isLogged: boolean };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };
    sessionServiceMock = { isLogged: false };

    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    });

    unauthGuard = TestBed.inject(UnauthGuard);
  });

  it('should redirect an authenticated user to the rentals page', () => {
    sessionServiceMock.isLogged = true;
    const result = unauthGuard.canActivate();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['rentals']);
  });

  it('should allow the navigation for an unauthenticated user', () => {
    sessionServiceMock.isLogged = false;
    const result = unauthGuard.canActivate();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
