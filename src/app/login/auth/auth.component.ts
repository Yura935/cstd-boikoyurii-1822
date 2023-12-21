import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForage } from 'ngforage';
import { FontSize } from 'src/app/classes/fontSize.model';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  public isAuth: boolean = true;
  public authForm: FormGroup;
  public signInForm: FormGroup;
  private regExpPass = /^[A-Za-z\d+=]{6,30}$/gm;
  private size: FontSize = {
    id: 's2',
    title: '1.4em',
    text: '16px',
  };

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private themeService: ThemeService,
    private readonly ngf: NgForage
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      userName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.pattern(this.regExpPass),
      ]),
    });
    this.signInForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        ,
        Validators.pattern(this.regExpPass),
      ]),
    });
    localStorage.removeItem('contact');
  }

  signUp(): void {
    this.dataService.signUp(this.authForm.value);
    localStorage.setItem('theme', JSON.stringify(this.themeService.light));
    localStorage.setItem('fontSize', JSON.stringify(this.size));
  }

  signIn(): void {
    this.dataService.signIn(this.signInForm.value);
    localStorage.setItem('theme', JSON.stringify(this.themeService.light));
    localStorage.setItem('fontSize', JSON.stringify(this.size));
  }

  changeChoice(): void {
    this.isAuth = !this.isAuth;
  }
}
