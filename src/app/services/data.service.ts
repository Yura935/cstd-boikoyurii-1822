import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUserData } from '../interfaces/userData.interface';
import { NgForage } from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseImage = 'assets/icons/user.svg';
  private dbPath = '/users';
  public userRef: AngularFirestoreCollection<IUserData>;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private readonly ngf: NgForage
  ) {
    this.userRef = this.db.collection(this.dbPath);
  }

  signUp(formGroup): void {
    this.auth
      .createUserWithEmailAndPassword(formGroup.email, formGroup.password)
      .then((response) => {
        const user = {
          userName: formGroup.userName,
          email: formGroup.email,
          image: this.baseImage,
          contacts: [],
        };
        this.db
          .collection('users')
          .add({ ...user })
          .then((collection) => {
            collection.get().then((user) => {
              const myUser = {
                id: user.id,
                ...(user.data() as any),
              };
              localStorage.setItem('user', JSON.stringify(myUser));
              this.router.navigateByUrl('main');
            });
          });
      });
  }

  signIn(myform): void {
    this.auth
      .signInWithEmailAndPassword(myform.email, myform.password)
      .then((userResponse) => {
        this.db
          .collection('users')
          .ref.where('email', '==', userResponse.user.email)
          .onSnapshot((snap) => {
            snap.forEach((user) => {
              const myUser = {
                id: user.id,
                ...(user.data() as any),
              };
              this.ngf.setItem('user', myUser);
              this.router.navigateByUrl('main');
            });
          });
      })
      .catch((err) => {
        alert(err);
      });
  }

  signOut(): void {
    this.auth
      .signOut()
      .then(() => {
        this.ngf.removeItem('user');
        localStorage.removeItem('contact');
        this.ngf.removeItem('transLang');
        this.router.navigateByUrl('login');
      })
      .catch((err) => {
        alert(err);
      });
  }

  getAll(): AngularFirestoreCollection<IUserData> {
    return this.userRef;
  }

  update(id: string, data: any): Promise<void> {
    return this.userRef.doc(id).update({ ...data });
  }
}
