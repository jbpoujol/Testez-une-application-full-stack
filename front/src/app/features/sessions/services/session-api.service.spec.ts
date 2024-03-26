import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { firstValueFrom, of } from 'rxjs';
describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpClientSpy: jest.Mocked<HttpClient>;

  beforeEach(() => {
    // Mock HttpClient
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      put: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        SessionApiService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(SessionApiService);
  });

  it('should return expected sessions (HttpClient.get called once)', async () => {
    const expectedSessions: any[] = [{ id: '123', name: 'Test Session' }];

    httpClientSpy.get.mockReturnValue(of(expectedSessions));

    const sessions = await firstValueFrom(service.all());
    expect(sessions).toEqual(expectedSessions);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith('api/session');
  });

  it('should get session detail (HttpClient.get called once)', async () => {
    const expectedSession: any = { id: '123', name: 'Test Session' };

    httpClientSpy.get.mockReturnValue(of(expectedSession));

    const session = await firstValueFrom(service.detail('123'));
    expect(session).toEqual(expectedSession);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith('api/session/123');
  });
  it('should delete a session', async () => {
    httpClientSpy.delete.mockReturnValue(of(null));

    await service.delete('123');
    expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.delete).toHaveBeenCalledWith('api/session/123');
  });

  it('should create a session', async () => {
    const expectedSession: any = { id: '123', name: 'Test Session' };

    httpClientSpy.post.mockReturnValue(of(expectedSession));

    const session = await firstValueFrom(service.create(expectedSession));
    expect(session).toEqual(expectedSession);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'api/session',
      expectedSession
    );
  });

  it('should update a session', async () => {
    const expectedSession: any = { id: '123', name: 'Test Session' };

    httpClientSpy.put.mockReturnValue(of(expectedSession));

    const session = await firstValueFrom(
      service.update('123', expectedSession)
    );
    expect(session).toEqual(expectedSession);
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.put).toHaveBeenCalledWith(
      'api/session/123',
      expectedSession
    );
  });

  it('should participate in a session', async () => {
    const expectedSession: any = { id: '123', name: 'Test Session' };

    httpClientSpy.post.mockReturnValue(of(expectedSession));

    const session = await firstValueFrom(service.participate('123', '456'));
    expect(session).toEqual(expectedSession);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'api/session/123/participate/456',
      null
    );
  });

  it('should unparticipate in a session', async () => {
    httpClientSpy.delete.mockReturnValue(of(null));

    await service.unParticipate('123', '456');
    expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.delete).toHaveBeenCalledWith(
      'api/session/123/participate/456'
    );
  });
});
