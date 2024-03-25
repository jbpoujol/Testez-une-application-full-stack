import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
class RouterMock {
  navigate = jest.fn();
}

class SessionServiceMock {
  $isLogged = jest.fn();
  logOut = jest.fn();
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sessionService: SessionServiceMock;
  let router: RouterMock;

  beforeEach(async () => {
    const materialModule = [
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatSnackBarModule,
      MatToolbarModule,
    ];

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ...materialModule,
      ],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: SessionService, useClass: SessionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(
      SessionService
    ) as unknown as SessionServiceMock;
    router = TestBed.inject(Router) as unknown as RouterMock;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('$isLogged() should call SessionService.$isLogged', () => {
    const loggedObservable = of(true);
    sessionService.$isLogged.mockReturnValue(loggedObservable);

    const result = component.$isLogged();

    expect(sessionService.$isLogged).toHaveBeenCalled();
    expect(result).toEqual(loggedObservable);
  });

  it('logout() should call SessionService.logOut and navigate to home', () => {
    component.logout();

    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
