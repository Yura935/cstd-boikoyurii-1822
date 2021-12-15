import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { RouterTestingModule } from '@angular/router/testing';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  const routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        RouterTestingModule,
      ]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set mainColor', () => {
    const setMainColorMock = spyOn(service, 'setMainColor');
    const mock = "#fff";
    service.setMainColor(mock);
    expect(service.mainColor).toBeDefined();
    expect(setMainColorMock).toHaveBeenCalled();
  });

  it('should set mainHeadColor', () => {
    const setMainHeadColorMock = spyOn(service, 'setMainHeadColor');
    const mock = "#fff";
    service.setMainHeadColor(mock);
    expect(service.mainHeadColor).toBeDefined();
    expect(setMainHeadColorMock).toHaveBeenCalled();
  });

  it('should set textColor', () => {
    const setTextColorMock = spyOn(service, 'setMainTextColor');
    const mock = "#fff";
    service.setMainTextColor(mock);
    expect(service.mainTextColor).toBeDefined();
    expect(setTextColorMock).toHaveBeenCalled();
  });

  it('should set currentElement', () => {
    const setTextColorMock = spyOn(service, 'setCurrentElement');
    const mock = "url(../../../assets/icons/close.svg)";
    service.setCurrentElement(mock);
    expect(service.currentElement).toBeDefined();
    expect(setTextColorMock).toHaveBeenCalledWith(mock);
  });

  it('signUp should be called', () => {
    const signUpMock = spyOn(service, 'signUp');
    const mockUser = {
      userName: 'user',
      email: 'user@gmail.com',
      image: 'assets/icons/user.svg',
      contacts: []
    };
    service.signUp(mockUser);
    expect(signUpMock).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toBeDefined();
  });

  it('signIn should be called', () => {
    const signInMock = spyOn(service, 'signIn');
    const mockUser = {
      email: 'user@gmail.com',
      password: 'qwerty123'
    };
    service.signIn(mockUser);
    expect(signInMock).toHaveBeenCalledWith(mockUser);
    expect(routerSpy.navigateByUrl).toBeDefined();
  });

  it('signOut should be called', () => {
    const signOutMock = spyOn(service, 'signOut');
    service.signOut();
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigateByUrl).toBeDefined();
  });

  it('should return all Users', () => {
    const spy = spyOn(service, 'getAll');
    service.getAll();
    expect(spy).toHaveBeenCalled();
  })

  it('userRef should be defined', () => {
    expect(service.userRef).toBeDefined();
  })

  it('should update user data', () => {
    const idMock = '0YJxwXlIc7R5AmGaBA11';
    const mockUser = {
      userName: 'user',
      email: 'user@gmail.com',
      id: '0YJxwXlIc7R5AmGaBA11',
      image: 'assets/icons/user.svg',
      contacts: []
    };
    service.update(idMock, mockUser)
      .then(() =>
        service.getAll().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          ),
          take(2)
        ).subscribe(data => {
          expect(data.find(el => el.id === idMock)).toEqual(mockUser);
        }))
  })
});
