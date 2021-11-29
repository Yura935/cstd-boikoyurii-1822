import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { UserData } from 'src/app/classes/userData.model';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let dataServiceMock: DataService;
  dataServiceMock = jasmine.createSpyObj('DataService', ['getAll']);
  let userMock: UserData = {
    userName: 'user',
    email: 'user@gmail.com',
    id: '0YJxwXlIc7R5AmGaBA11',
    image: 'assets/icons/user.svg',
    contacts: [
      {
        email: "yur13boj9@gmail.com",
        id: "WG5JodVsH6IoInJJIw02",
        image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QNnaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkU5NjYxRjIwMTMwRTkyNTY3QjZCOTJGQUFDRTQ1NDI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5OTU4RTJGRTVDNjExRTVBOERFRDkwOUVGMkJCMTMxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5OTU4RTJFRTVDNjExRTVBOERFRDkwOUVGMkJCMTMxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEQyNzg2NTREQURDRTMxMTlEN0M4RTNGMjNDRDU4QTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDgyNzg2NTREQURDRTMxMTlEN0M4RTNGMjNDRDU4QTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+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",
        isContact: true,
        lastMessage: { id: '', date: null, message: '', userName: 'admin123' },
        messages: [],
        userName: "admin123"
      }
    ]
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
    localStorage.setItem('user', JSON.stringify(userMock));
    dataServiceMock.mainColor = new Subject<any>();
    dataServiceMock.mainHeadColor = new Subject<any>();
    dataServiceMock.mainTextColor = new Subject<any>();
    dataServiceMock.currentContact = new Subject<any>();
    dataServiceMock.currentElement = new Subject<any>();
    dataServiceMock.adding = new Subject<any>();
    dataServiceMock.mainColor.next('#fefefe');
    dataServiceMock.mainHeadColor.next('gray');
    dataServiceMock.mainTextColor.next('#000');
    dataServiceMock.currentElement.next('url(../../../assets/icons/close.svg)');
    dataServiceMock.adding.next(true);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dataServiceMock = TestBed.inject(DataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user data', () => {
    const spy = spyOn(component, 'getUserData').and.callFake(() => userMock);
    component.ngOnInit();
    expect(component.user).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(component.getAll).toBeTruthy();
  })

  it('left should be 0px', () => {
    component.openSideBar();
    expect(component.left).toBe('0px');
  })

  it('left should be -300px', () => {
    component.closeSideBar();
    expect(component.left).toBe('-300px');
    expect(component.changeLang).toBeFalse();
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
    dataServiceMock.mainColor.subscribe(data => expect(data).toBe('#3C3B3F'));
    expect(component.changeLang).toBeFalse();
  })

  it('should change theame to light', () => {
    component.isDark = true;
    component.toggleView();
    expect(component.isDark).toBeFalse();
    dataServiceMock.mainColor.subscribe(data => expect(data).toBe('#fefefe'));
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
    const spy = spyOn(component, 'getUserData').and.callFake(() => component.user = userMock)
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

  it('chooseContact should have been called', () => {
    const emit = new EventEmitter;
    const spy = spyOn(component, 'chooseContact');
    component.chooseContact(emit);
    expect(spy).toHaveBeenCalled();
  })
});
