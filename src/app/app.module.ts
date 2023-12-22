import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './login/auth/auth.component';
import { HomeComponent } from './components/home/home.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { FilterPipe } from './pipes/filter.pipe';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgClickOutsideModule } from 'ng-click-outside2';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ClearHistoryModalComponent } from './components/clear-history-modal/clear-history-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

import { DEFAULT_CONFIG, NgForageOptions, Driver } from 'ngforage';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json?cb=' + new Date().getTime()
  );
}

// bug with checking passwords, deosn't display message when it should
export function fieldMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

export function formlyValidationConfig(translate: TranslateService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return translate.stream('auth.validation.required');
        },
      },
    ],
  };
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    FilterPipe,
    DeleteModalComponent,
    ClearHistoryModalComponent,
    SettingsModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    BrowserAnimationsModule,
    NgClickOutsideModule,
    MatDialogModule,
    MatButtonModule,
    FormlyModule.forRoot({
      validators: [
        { name: 'email', validation: Validators.email },
        { name: 'fieldMatch', validation: fieldMatchValidator },
      ],
      // validationMessages: [
      //   { name: 'required', message: 'This field is required' },
      // ],
    }),
    FormlyBootstrapModule,
  ],
  providers: [
    FilterPipe,
    {
      provide: DEFAULT_CONFIG,
      useValue: {
        name: 'MyApp',
        driver: [
          // defaults to indexedDB -> webSQL -> localStorage
          Driver.INDEXED_DB,
          Driver.LOCAL_STORAGE,
        ],
      } as NgForageOptions,
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: formlyValidationConfig,
      deps: [TranslateService],
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
