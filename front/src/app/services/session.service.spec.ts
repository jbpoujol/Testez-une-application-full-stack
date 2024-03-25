import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should log in a user', () => {
    const mockUser = {
      username: 'testUser',
      id: 1,
      token: 'exampleToken',
      type: 'exampleType',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    }; // Example mock user
    service.logIn(mockUser);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('should emit true when logged in', () => {
    const mockUser = {
      username: 'testUser',
      id: 1,
      token: 'exampleToken',
      type: 'exampleType',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    }; // Example mock user
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
    });
    service.logIn(mockUser);
  });

  it('should log out a user', () => {
    const mockUser = {
      username: 'testUser',
      id: 1,
      token: 'exampleToken',
      type: 'exampleType',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    }; // Example mock user
    service.logIn(mockUser);
    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit false when logged out', () => {
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
    service.logOut();
  });
});
