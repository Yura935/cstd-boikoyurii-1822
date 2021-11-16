import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let service: DataService;
  let fb: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [AuthComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(DataService);
    fb = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create forms', () => {
    component.ngOnInit();
    expect(component.authForm).toBeTruthy();
    expect(component.signInForm).toBeTruthy();
  })

  it('signUp should be called', () => {
    const spy = spyOn(component, 'signUp');
    component.signUp();
    expect(spy).toHaveBeenCalled();
  })

  it('signIn should be called', () => {
    const spy = spyOn(component, 'signIn');
    component.signIn();
    expect(spy).toHaveBeenCalled();
  })

  it('should change isAuth', () => {
    component.changeChoise();
    expect(component.isAuth).toBeFalse();
  })
});
