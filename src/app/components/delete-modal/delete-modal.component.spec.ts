import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FIREBASE_OPTIONS } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

import { DeleteModalComponent } from './delete-modal.component';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;

  function httpTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
        }
      }),],
      declarations: [DeleteModalComponent],
      providers: [
        AngularFirestore,
        { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
        {
          provide: MatDialogRef,
          useValue: []
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: []
        },
        TranslateService, TranslateStore, TranslateLoader
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    localStorage.setItem('fontSize', JSON.stringify('14px'));
    component.data.user = {
      userName: 'user',
      email: 'user@gmail.com',
      id: '0YJxwXlIc7R5AmGaBA11',
      image: 'assets/icons/user.svg',
      backgroundChat: 'https://firebasestorage.googleapis.com/v0/b/clearchat-e1062.appspot.com/o/image%2Fmobile-apps-pattern-260nw-362377472.webp?alt=media&token=3f4cb8a8-6713-43e5-a206-9f5259cf2b65',
      contacts: [
        {
          email: "yur13boj9@gmail.com",
          id: "WG5JodVsH6IoInJJIw02",
          image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QNnaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkU5NjYxRjIwMTMwRTkyNTY3QjZCOTJGQUFDRTQ1NDI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5OTU4RTJGRTVDNjExRTVBOERFRDkwOUVGMkJCMTMxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5OTU4RTJFRTVDNjExRTVBOERFRDkwOUVGMkJCMTMxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEQyNzg2NTREQURDRTMxMTlEN0M4RTNGMjNDRDU4QTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDgyNzg2NTREQURDRTMxMTlEN0M4RTNGMjNDRDU4QTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+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",
          isContact: true,
          lastMessage: { id: 0, date: null, message: '', file: { name: '', url: '' }, userId: '', edited: false },
          messages: [],
          userName: "admin123"
        }
      ]
    };
    component.data.myUser = {
      userName: 'user',
      email: 'user@gmail.com',
      id: '0YJxwXlIc7R5AmGaBA11',
      image: 'assets/icons/user.svg',
      backgroundChat: 'https://firebasestorage.googleapis.com/v0/b/clearchat-e1062.appspot.com/o/image%2Fmobile-apps-pattern-260nw-362377472.webp?alt=media&token=3f4cb8a8-6713-43e5-a206-9f5259cf2b65',
      contacts: [
        {
          email: "yur13boj9@gmail.com",
          id: "WG5JodVsH6IoInJJIw02",
          image: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QNnaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkU5NjYxRjIwMTMwRTkyNTY3QjZCOTJGQUFDRTQ1NDI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5OTU4RTJGRTVDNjExRTVBOERFRDkwOUVGMkJCMTMxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5OTU4RTJFRTVDNjExRTVBOERFRDkwOUVGMkJCMTMxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEQyNzg2NTREQURDRTMxMTlEN0M4RTNGMjNDRDU4QTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDgyNzg2NTREQURDRTMxMTlEN0M4RTNGMjNDRDU4QTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+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",
          isContact: true,
          lastMessage: { id: 0, date: null, message: '', file: { name: '', url: '' }, userId: '', edited: false },
          messages: [],
          userName: "admin123"
        }
      ]
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
