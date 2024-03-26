import { expect } from '@jest/globals';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { FormComponent } from './form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Session } from '../../interfaces/session.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionApiService: Partial<
    Record<keyof SessionApiService, jest.Mock>
  > = {
    create: jest.fn().mockReturnValue(of({} as Session)),
    update: jest.fn().mockReturnValue(of({} as Session)),
    detail: jest.fn().mockReturnValue(of({} as Session)),
  };
  let mockSessionService: Partial<SessionService>;
  let mockTeacherService: Partial<TeacherService>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    route = {
      snapshot: {
        paramMap: convertToParamMap({ id: '1' }),
      },
    } as any;

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
        NoopAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: DummyComponent },
        ]),
      ],
      declarations: [FormComponent, DummyComponent],
      providers: [
        FormBuilder,
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: route },
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

  it('should initialize form with empty values when session is not provided', () => {
    component.ngOnInit();

    expect(component.sessionForm?.value.name).toBe('');
    expect(component.sessionForm?.value.date).toBe('');
    expect(component.sessionForm?.value.teacher_id).toBe('');
    expect(component.sessionForm?.value.description).toBe('');
  });

  it('should redirect non-admin users', fakeAsync(() => {
    mockSessionService.sessionInformation = {
      admin: false,
      token: 'dummy-token',
      type: 'admin',
      id: 1,
      username: 'john.doe',
      firstName: 'John',
      lastName: 'Doe',
    };
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.ngOnInit();
    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  }));

  it('should initialize the form with session data on update', fakeAsync(() => {
    // Configurer l'environnement pour simuler une mise à jour
    jest.spyOn(router, 'url', 'get').mockReturnValue('/update');
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('1');
    const sessionDetail = {
      id: 1,
      name: 'Session 1',
      date: '2022-01-01',
      teacher_id: 'teacher1',
      description: 'Description',
      users: [],
    } as unknown as Session;

    jest
      .spyOn(mockSessionApiService, 'detail')
      .mockReturnValue(of(sessionDetail));

    component.ngOnInit();
    tick();

    expect(component.sessionForm?.value).toEqual(
      expect.objectContaining({
        name: sessionDetail.name,
        date: expect.any(String),
        teacher_id: sessionDetail.teacher_id,
        description: sessionDetail.description,
      })
    );
  }));

  it('should initialize the form for a new session', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/new');

    component.ngOnInit();

    expect(component.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    });
  });

  it('should create a new session and navigate away', fakeAsync(() => {
    jest
      .spyOn(mockSessionApiService, 'create')
      .mockReturnValue(of({} as Session));
    jest.spyOn(router, 'navigate');
    jest.spyOn(component as any, 'exitPage');

    component.sessionForm = undefined;

    component.submit();
    flush();

    expect((component as any).exitPage).toHaveBeenCalledWith(
      'Session created !'
    );
    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  }));

  it('should update an existing session and navigate away', fakeAsync(() => {
    component.sessionForm = new FormBuilder().group({
      name: ['Test Session'],
      date: ['2021-01-01'],
      teacher_id: ['teacher1'],
      description: ['Description here'],
    });

    component.onUpdate = true;
    (component as any).id = '1';

    jest
      .spyOn(mockSessionApiService, 'update')
      .mockReturnValue(of({} as Session));
    jest.spyOn(router, 'navigate');
    jest.spyOn(component as any, 'exitPage');

    component.submit();
    flush();

    expect(mockSessionApiService.update).toHaveBeenCalledWith(
      '1',
      expect.anything()
    );
    expect((component as any).exitPage).toHaveBeenCalledWith(
      'Session updated !'
    );

    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  }));
});
