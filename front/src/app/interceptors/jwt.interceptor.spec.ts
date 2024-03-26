import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { JwtInterceptor } from './jwt.interceptor';
import { SessionService } from '../services/session.service';
import { expect } from '@jest/globals';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let mockSessionService: Partial<SessionService>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {
    // Initialisation du mock de SessionService
    mockSessionService = {
      isLogged: false,
      sessionInformation: {
        type: 'fake-type',
        id: 1,
        username: 'fake-username',
        firstName: 'fake-firstName',
        lastName: 'fake-lastName',
        admin: false,
        token: 'fake-token',
      },
    };

    // Initialisation du mock de HttpHandler
    mockHttpHandler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>)),
    };

    // Création de l'instance de JwtInterceptor avec le mock de SessionService
    interceptor = new JwtInterceptor(mockSessionService as SessionService);
  });

  it('should add an Authorization header when user is logged in', () => {
    mockSessionService.isLogged = true;

    const httpRequest = new HttpRequest('GET', '/test');

    const httpHandlerSpy = jest
      .spyOn(mockHttpHandler, 'handle')
      .mockImplementation((request) => {
        const authHeader = request.headers.get('Authorization');
        expect(authHeader).toEqual('Bearer fake-token');
        return of({} as HttpEvent<any>);
      });

    interceptor.intercept(httpRequest, mockHttpHandler);

    expect(httpHandlerSpy).toHaveBeenCalled();
  });

  it('should not modify the request when user is not logged in', () => {
    mockSessionService.isLogged = false;

    const httpRequest = new HttpRequest('GET', '/test');
    const cloneSpy = jest.spyOn(httpRequest, 'clone');
    const httpHandlerSpy = jest.spyOn(mockHttpHandler, 'handle');

    interceptor.intercept(httpRequest, mockHttpHandler);

    expect(cloneSpy).not.toBeCalled();
    expect(httpHandlerSpy).toBeCalledWith(httpRequest);
  });
});
