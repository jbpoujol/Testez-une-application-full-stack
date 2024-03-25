import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
// Mock des services
class RouterMock {
  navigate = jest.fn();
}

class MatSnackBarMock {
  open = jest.fn();
}

class SessionServiceMock {
  sessionInformation = { id: 123 };
  logOut = jest.fn();
}

class UserServiceMock {
  getById = jest.fn().mockReturnValue(of({ id: '123', name: 'John Doe' }));
  delete = jest.fn().mockReturnValue(of(null));
}

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserServiceMock;

  beforeEach(async () => {
    userService = new UserServiceMock();

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: MatSnackBar, useClass: MatSnackBarMock },
        { provide: SessionService, useClass: SessionServiceMock },
        { provide: UserService, useValue: userService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('ngOnInit() should fetch user data', () => {
    component.ngOnInit();
    expect(userService.getById).toHaveBeenCalledWith('123');
    expect(component.user).toEqual({ id: '123', name: 'John Doe' });
  });

  it('back() should call window.history.back()', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('delete() should delete the user, show snackbar, log out and navigate to home', () => {
    component.delete();
    expect(userService.delete).toHaveBeenCalledWith('123');
    expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(TestBed.inject(SessionService).logOut).toHaveBeenCalled();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/']);
  });
});
