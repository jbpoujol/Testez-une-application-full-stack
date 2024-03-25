import { expect } from '@jest/globals';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { FormComponent } from './form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Session } from '../../interfaces/session.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { NgZone } from '@angular/core';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionApiService: Partial<SessionApiService>;
  let mockSessionService: Partial<SessionService>;
  let mockTeacherService: Partial<TeacherService>;
  let router: Router;
  let ngZone: NgZone;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        url: [
          { path: 'update' },
          { path: '1' }, // Assuming '1' is the id for testing
        ],
        paramMap: convertToParamMap({ id: '1' }), // Populate paramMap with id
      },
    };

    mockSessionService = {
      sessionInformation: {
        admin: true,
        token: 'dummy-token',
        type: 'admin',
        id: 1,
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    mockTeacherService = {
      all: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
      ],
      declarations: [FormComponent],
      providers: [
        FormBuilder,
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockTeacherService.all).toHaveBeenCalled();
  });
  /* 
  it('should initialize for update when id is present in URL', () => {
    console.log((TestBed.inject(ActivatedRoute) as any).snapshot);

    expect(component.onUpdate).toBeTruthy();
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
  }); */
  /* 
  it('should submit and call create method for new session', () => {
    component.onUpdate = false;
    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalled();
  }); */
  /* 
  it('should submit and call update method for existing session', () => {
    component.onUpdate = true;
    (component as any).id = '1'; // Assuming '1' is a valid id for update
    component.submit();
    expect(mockSessionApiService.update).toHaveBeenCalledWith(
      '1',
      expect.any(Object)
    );
  }); */

  it('should initialize form with empty values when session is not provided', () => {
    component.ngOnInit();

    // Now you can assert the state of the form when no session data is provided
    expect(component.sessionForm?.value.name).toBe('');
    expect(component.sessionForm?.value.date).toBe('');
    expect(component.sessionForm?.value.teacher_id).toBe('');
    expect(component.sessionForm?.value.description).toBe('');
  });
});
