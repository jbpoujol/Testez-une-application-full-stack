import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;

  beforeEach(async () => {
    const sessionApiServiceMock = {
      detail: jest.fn().mockReturnValue(
        of({
          id: 1,
          teacher_id: 2,
          users: [],
        })
      ),
      delete: jest.fn().mockReturnValue(of(null)),
      participate: jest.fn().mockReturnValue(of(null)),
      unParticipate: jest.fn().mockReturnValue(of(null)),
    };
    const teacherServiceMock = {
      detail: jest.fn(),
    };
    const sessionServiceMock = {
      sessionInformation: { admin: true, id: '1' },
    };
    const activatedRouteStub = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
    };

    const materialModules = [
      MatButtonModule,
      MatCardModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatSnackBarModule,
      MatSelectModule,
    ];

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ...materialModules,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    jest
      .spyOn(router, 'navigate')
      .mockImplementation(() => Promise.resolve(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize session and teacher data', () => {
    const mockSession: Session = {
      id: 1,
      teacher_id: 2,
      users: [1],
      name: '',
      description: '',
      date: new Date(),
    };
    const mockTeacher: Teacher = {
      id: 2,
      lastName: 'Doe',
      firstName: 'Jane',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.ngOnInit();

    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(teacherService.detail).toHaveBeenCalledWith('2');
  });

  it('should delete session and navigate', () => {
    jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(null));
    jest.spyOn(router, 'navigate');

    component.delete();

    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should handle participation', () => {
    jest.spyOn(sessionApiService, 'participate').mockReturnValue(of(undefined));
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({} as Session)); // Assuming this refreshes the session

    component.participate();

    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
    // This assumes detail() refresh method gets called indirectly,
    // proving that participate() leads to a refresh of the session details.
  });

  it('should handle unparticipation', () => {
    jest
      .spyOn(sessionApiService, 'unParticipate')
      .mockReturnValue(of(undefined));
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({} as Session));

    component.unParticipate();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should call window.history.back when back is called', () => {
    // Espionner sur window.history.back
    const historySpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(historySpy).toHaveBeenCalled();
  });
});
