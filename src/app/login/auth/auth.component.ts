import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { FontSize } from 'src/app/classes/fontSize.model';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent implements OnInit {
  public isAuth: boolean = true;
  public signUpForm: FormGroup = new FormGroup({});
  public signInForm: FormGroup = new FormGroup({});
  private regExpPass = /^[A-Za-z\d+=]{6,30}$/gm;
  private size: FontSize = {
    id: 's2',
    title: '1.4em',
    text: '16px',
  };
  signInModel = {
    email: '',
    password: '',
  };
  signInOptions: FormlyFormOptions = {};
  signInFields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        // label: 'Email address',
        type: 'email',
        // placeholder: 'Enter email',
        required: true,
      },
      validators: {
        validation: [Validators.email],
      },
      validation: {
        messages: {
          email: (error, field: FormlyFieldConfig) =>
            `"${field.formControl.value}" is not a valid email`,
        },
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('auth.email'),
        'templateOptions.placeholder': this.translate.stream(
          'auth.emailPlaceholder'
        ),
      },
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        // label: 'Password',
        type: 'password',
        // placeholder: 'Enter password',
        required: true,
        // pattern: this.regExpPass,
        minLength: 6,
      },
      validation: {
        messages: {
          pattern: (error, field: FormlyFieldConfig) => `Invalid password`,
          minLength: (error, field: FormlyFieldConfig) =>
            `Should have at least ${field.templateOptions.minLength} characters`,
        },
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('auth.password'),
        'templateOptions.placeholder': this.translate.stream(
          'auth.passwordPlaceholder'
        ),
      },
    },
  ];
  signUpModel = {
    userName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };
  signUpOptions: FormlyFormOptions = {};
  signUpFields: FormlyFieldConfig[] = [
    {
      key: 'userName',
      type: 'input',
      templateOptions: {
        label: 'Username',
        placeholder: 'Enter username',
        required: true,
        min: 5,
      },
      validation: {
        messages: {
          min: (error, field: FormlyFieldConfig) =>
            `Should have at least ${field.templateOptions.min} characters`,
        },
      },
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        // label: 'Email address',
        type: 'email',
        // placeholder: 'Enter email',
        required: true,
      },
      validators: {
        validation: ['email'],
      },
      validation: {
        messages: {
          email: (error, field: FormlyFieldConfig) => {
            console.log(field);
            return `"${field.formControl.value}" is not a valid email`;
          },
        },
      },
      asyncValidators: {
        uniqueUsername: {
          expression: (control: FormControl) => {
            return new Promise((resolve, reject) => {
              resolve(control.value !== 'user@gmail.com');
            });
          },
          message: 'This email is already taken.',
        },
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('auth.email'),
        'templateOptions.placeholder': this.translate.stream(
          'auth.emailPlaceholder'
        ),
      },
    },
    {
      validators: {
        validation: [
          { name: 'fieldMatch', options: { errorPath: 'passwordConfirm' } },
        ],
      },
      fieldGroup: [
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            // label: 'Password',
            type: 'password',
            // placeholder: 'Enter password',
            required: true,
            pattern: this.regExpPass,
            min: 6,
          },
          validation: {
            messages: {
              pattern: (error, field: FormlyFieldConfig) => `Invalid password`,
              minLength: (error, field: FormlyFieldConfig) =>
                `Should have at least ${field.templateOptions.minLength} characters`,
            },
          },
          expressionProperties: {
            'templateOptions.label': this.translate.stream('auth.password'),
            'templateOptions.placeholder': this.translate.stream(
              'auth.passwordPlaceholder'
            ),
          },
        },
        {
          key: 'passwordConfirm',
          type: 'input',
          templateOptions: {
            // label: 'Confirm Password',
            type: 'password',
            // placeholder: 'Please re-enter your password',
            required: true,
            pattern: this.regExpPass,
          },
          expressionProperties: {
            'templateOptions.label': this.translate.stream(
              'auth.confirmPassword'
            ),
            'templateOptions.placeholder': this.translate.stream(
              'auth.confirmPasswordPlaceholder'
            ),
          },
        },
      ],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private themeService: ThemeService,
    public translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();

    translate.use(browserLang.match(/en|ua/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    localStorage.removeItem('contact');
  }

  signUp(): void {
    if (this.signUpForm.valid) {
      this.dataService.signUp(this.signUpForm.value);
      localStorage.setItem('theme', JSON.stringify(this.themeService.light));
      localStorage.setItem('fontSize', JSON.stringify(this.size));
    }
  }

  signIn(): void {
    if (this.signInForm.valid) {
      this.dataService.signIn(this.signInForm.value);
      localStorage.setItem('theme', JSON.stringify(this.themeService.light));
      localStorage.setItem('fontSize', JSON.stringify(this.size));
    }
  }

  changeChoice(): void {
    this.isAuth = !this.isAuth;
  }
}
