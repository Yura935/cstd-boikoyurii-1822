import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let dataServiceMock: DataService;
  let userMock = {
    userName: 'user',
    email: 'user@gmail.com',
    id: '0YJxwXlIc7R5AmGaBA11',
    image: 'assets/icons/user.svg',
    contacts: []
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        BrowserDynamicTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        RouterTestingModule,
      ],
      declarations: [UserListComponent, FilterPipe],
      providers: [DataService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dataServiceMock = TestBed.inject(DataService);
    localStorage.setItem('user', JSON.stringify(userMock));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user data', () => {
    const spy = spyOn(component as any, 'getUserData').and.returnValue(userMock);
    component.ngOnInit();
    expect(component.user).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(component.getAll).toBeTruthy();
  })

  it('left should be 0px', () => {
    const spy = spyOn(component, 'openSideBar');
    component.openSideBar();
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('left should be -300px', () => {
    const spy = spyOn(component, 'closeSideBar');
    component.closeSideBar();
    expect(component.left).toBe('-300px');
    expect(component.changeLang).toBeFalse();
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('should change changeLang', () => {
    component.openLangModal();
    expect(component.changeLang).toBeTrue();
  })

  it('should change language to en', () => {
    const elementMock = document.createElement('input');
    elementMock.id = 'en';
    component.changeLanguage(elementMock);
    expect(component.lang).toBe('en');
  })

  it('should change language to ua', () => {
    const elementMock = document.createElement('input');
    elementMock.id = 'ua';
    component.changeLanguage(elementMock);
    expect(component.lang).toBe('ua');
  })

  it('should change theame to dark', () => {
    component.toggleView();
    expect(component.isDark).toBeTrue();
    expect(component.changeLang).toBeFalse();
  })

  it('should change theame to light', () => {
    component.isDark = true;
    component.toggleView();
    expect(component.isDark).toBeFalse();
    expect(component.changeLang).toBeFalse();
  })

  it('readFile should be called', () => {
    const elementMock = document.createElement('input');
    elementMock.id = 'image';
    const spy = spyOn(component, 'readFile');
    component.readFile(elementMock);
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('getUserData should be called', () => {
    component.getUserData();
    expect(component.user).toEqual(userMock);
    expect(component.image).toBeDefined();
  })

  it('signOut should be called', () => {
    const spy = spyOn(dataServiceMock, 'signOut');
    component.signOut();
    expect(spy).toHaveBeenCalled();
  })

  it('should open edit modal', () => {
    const spy = spyOn(component, 'closeSideBar');
    component.openEditModal();
    expect(spy).toHaveBeenCalled();
    expect(component.display).toBe('block');
  })

  it('should close edit modal', () => {
    component.display = 'block';
    const spy = spyOn(component, 'closeSideBar');
    component.openEditModal();
    expect(spy).toHaveBeenCalled();
    expect(component.display).toBe('none');
  })

  it('should update user data', () => {
    component.display = 'block';
    const spy = spyOn(dataServiceMock, 'update');
    const Spy = spyOn(component, 'getUserData');
    component.updateUserData();
    expect(spy).toHaveBeenCalled();
    expect(component.display).toBe('none');
    expect(Spy).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('user')).toBeTruthy();
  })
});
