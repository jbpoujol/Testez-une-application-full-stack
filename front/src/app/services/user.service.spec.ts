import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure there are no outstanding requests
  });

  it('getById should return a user data by ID', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      lastName: 'Test',
      firstName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'testPassword',
      admin: false,
    };
    const id = 'testId';
    const expectedUrl = `api/user/${id}`; // Directly using the expected URL

    service.getById(id).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUser);
  });

  it('delete should remove a user by ID', () => {
    const id = 'testId';
    const expectedUrl = `api/user/${id}`; // Directly using the expected URL

    service.delete(id).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
