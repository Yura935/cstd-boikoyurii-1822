import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Contact } from '../classes/contact.model';
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
  public currentContact = new Subject<Contact>();
  public adding = new Subject<boolean>();

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    this.userRef = this.db.collection(this.dbPath);
  }

  signUp(formGroup): void {
    this.auth.createUserWithEmailAndPassword(formGroup.email, formGroup.password).then(response => {
      const user = {
        userName: formGroup.userName,
        email: formGroup.email,
        image: this.baseImage,
        contacts: []
      };
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

  signIn(myform): void {
    this.auth.signInWithEmailAndPassword(myform.email, myform.password)
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

  update(id: string, data: any): Promise<void> {
    return this.userRef.doc(id).update({ ...data });
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

  setCurrentContact(contact: Contact) {
    this.currentContact.next(contact);
  }

  setAdding(bool: boolean) {
    this.adding.next(bool);
  }
}
