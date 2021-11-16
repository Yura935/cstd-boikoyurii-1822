import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

import { UserMessangerComponent } from './user-messanger.component';

describe('UserMessangerComponent', () => {
  let component: UserMessangerComponent;
  let fixture: ComponentFixture<UserMessangerComponent>;
  let service: DataService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [UserMessangerComponent],
      providers: [DataService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMessangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(DataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mainColor, headColor, textColor, currentElement was defined', () => {
    component.ngOnInit();
    expect(component.bgColor).toBeTruthy();
    expect(component.bgColorHead).toBeDefined();
    expect(component.textColor).toBeDefined();
    expect(component.currentElement).toBeDefined();
  })

  it('should change isClick to flex', () => {
    component.openUserInfo();
    expect(component.isClick).toBe('flex');
  })

  it('should change isClick to none', () => {
    component.isClick = 'flex';
    component.openUserInfo();
    expect(component.isClick).toBe('none');
  })
});
