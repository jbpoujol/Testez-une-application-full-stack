import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // S'assurer qu'il n'y a pas de requêtes en suspens après chaque test
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should send a POST request to register a user', () => {
    const mockRegisterRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    authService.register(mockRegisterRequest).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null);
  });
  it('should send a POST request to login a user', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSessionInfo: SessionInformation = {
      type: 'user',
      id: 123,
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      token: 'fake-jwt-token',
      admin: false,
    };

    authService.login(mockLoginRequest).subscribe((sessionInfo) => {
      expect(sessionInfo).toEqual(mockSessionInfo);
    });

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionInfo);
  });
});
