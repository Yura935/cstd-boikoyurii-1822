import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isAuth: boolean = true;
  authForm: FormGroup;
  signInForm: FormGroup;
  userName: string = '';
  email: string = '';
  password: string = '';
  regExpPass = /^[A-Za-z\d+=]{6,30}$/gm;
  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      userName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.pattern(this.regExpPass)])
    })
    this.signInForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, , Validators.pattern(this.regExpPass)])
    })
  }

  signUp(): void {
    this.dataService.signUp(this.authForm.value);
    const obj = {
      isDark: false,
      mainColor: "#fefefe",
      mainHeadColor: "slategrey",
      mainTextColor: "#000",
      currentElement: "url(../../../assets/icons/close.svg)"
    }
    localStorage.setItem('theme', JSON.stringify(obj));
  }

  signIn(): void {
    this.dataService.signIn(this.signInForm.value);
    const obj = {
      isDark: false,
      mainColor: "#fefefe",
      mainHeadColor: "slategrey",
      mainTextColor: "#000",
      currentElement: "url(../../../assets/icons/close.svg)"
    }
    localStorage.setItem('theme', JSON.stringify(obj));
  }

  changeChoise(): void {
    this.isAuth = !this.isAuth;
  }
}
