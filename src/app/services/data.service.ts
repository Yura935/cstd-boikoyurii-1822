import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IUserData } from '../interfaces/userData.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseImage = 'assets/icons/user.svg'
  private dbPath = '/users';
  userRef: AngularFirestoreCollection<IUserData>;
  public mainColor = new Subject<string>();
  public mainHeadColor = new Subject<string>();
  public mainTextColor = new Subject<string>();
  public currentElement = new Subject<string>();

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    this.userRef = this.db.collection(this.dbPath);
  }

  signUp(formGroup: FormGroup): void {
    this.auth.createUserWithEmailAndPassword(formGroup.get('email').value, formGroup.get('password').value).then(response => {
      const user = {
        userName: formGroup.get('userName').value,
        email: formGroup.get('email').value,
        image: this.baseImage,
        contacts: []
      };
      console.log(user);
      this.db.collection('users').add({ ...user })
        .then(collection => {
          collection.get()
            .then(user => {
              const myUser = {
                id: user.id,
                ...user.data() as any
              }
              localStorage.setItem('user', JSON.stringify(myUser));
              this.router.navigateByUrl('main');
            });
        });
    })
  }

  signIn(myform: FormGroup): void {
    this.auth.signInWithEmailAndPassword(myform.get('email').value, myform.get('password').value)
      .then(userResponse => {
        this.db.collection('users').ref.where('email', '==', userResponse.user.email).onSnapshot(
          snap => {
            snap.forEach(user => {
              const myUser = {
                id: user.id,
                ...user.data() as any
              };
              localStorage.setItem('user', JSON.stringify(myUser));
              this.router.navigateByUrl('main');
            });
          }
        );
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('login');
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  }

  getAll(): AngularFirestoreCollection<IUserData> {
    return this.userRef;
  }

  getOne(name: string): any {
    return this.userRef.ref.where('nickName', '==', name);
  }

  create(contact: IUserData): any {
    return this.userRef.add({ ...contact });
  }

  update(id: string, data: any): Promise<void> {
    return this.userRef.doc(id).update({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.userRef.doc(id).delete();
  }

  setMainHeadColor(color: string) {
    this.mainHeadColor.next(color);
  }

  setMainColor(color: string) {
    this.mainColor.next(color);
  }

  setMainTextColor(color: string) {
    this.mainTextColor.next(color);
  }

  setCurrentElement(str: string) {
    this.currentElement.next(str);
  }
}
