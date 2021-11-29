import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { debounceTime, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { Contact } from 'src/app/classes/contact.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  dataArray: Array<any> = [];
  currentContact: Contact;
  left: string = '-300px';
  isDark: boolean = false;
  bgColorHead: string = 'gray';
  bgColor: string = '#fefefe';
  user: IUserData;
  getAll: boolean = true;
  search: string = '';
  display: string = 'none';
  textColor: string = '#000';
  image: string = '';
  userName: string = '';
  email: string = '';
  changeLang: boolean = false;
  currentElement: string = 'url(../../../assets/icons/close.svg)';
  allUsers = [];
  lang: string = 'en';

  constructor(private dataService: DataService, private translate: TranslateService, private router: Router) { }

  ngOnInit(): void {
    this.getUserData();
    this.dataService.mainColor.subscribe(data => this.bgColor = data);
    this.dataService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.dataService.mainTextColor.subscribe(data => this.textColor = data);
    this.dataService.currentElement.subscribe(data => this.currentElement = data);
    this.getAllUsers();
    this.dataService.adding.subscribe(() => {
      this.getUserData();
      this.getAllUsers();
    });
  }

  openSideBar(): void {
    this.left = '0px';
  }

  closeSideBar(): void {
    this.left = '-300px';
    this.changeLang = false;
  }

  openLangModal(): void {
    this.changeLang = !this.changeLang;
  }

  changeLanguage(element): void {
    if (element.id === 'en') {
      this.lang = 'en';
    }
    else {
      this.lang = 'ua';
    }
  }

  toggleView(): void {
    this.isDark = !this.isDark;
    this.changeLang = false;
    if (this.isDark) {
      this.dataService.setMainColor('#3C3B3F');
      this.dataService.setMainHeadColor('#141E30');
      this.dataService.setMainTextColor('#fff');
      this.dataService.setCurrentElement('url(../../../assets/icons/closeW.svg)');
    }
    else {
      this.dataService.setMainColor('#fefefe');
      this.dataService.setMainHeadColor('gray');
      this.dataService.setMainTextColor('#000');
      this.dataService.setCurrentElement('url(../../../assets/icons/close.svg)');
    }
  }

  readFile(file): void {
    var reader = new FileReader();
    let image;
    reader.onload = (e) => {
      image = e.target.result;
      this.image = image;
    }
    reader.readAsDataURL(file.files[0]);
  }

  getUserData(): void {
    if (JSON.parse(localStorage.getItem('user'))) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.image = this.user.image;
    }
  }

  getAllUsers(): void {
    this.dataService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      ),
      debounceTime(200),
    ).subscribe(data => {
      this.allUsers = data;
      this.allUsers = this.allUsers.filter(el => el.id !== this.user.id);
      if (this.user.contacts) {
        this.user.contacts.forEach(elem => {
          this.allUsers = this.allUsers.filter(el => {
            if (el.id !== elem.id) {
              return el;
            }
          })
        })
      }
      if (this.router.url.length > 5) {
        const name = this.router.url.slice(6, this.router.url.length);
        this.currentContact = this.allUsers.find(el => el.userName === name);
        const newContact = this.user.contacts.find(el => el.userName === name);
        if (newContact) {
          const contact: Contact = {
            userName: newContact.userName,
            image: newContact.image,
            email: newContact.email,
            messages: newContact.messages,
            lastMessage: newContact.lastMessage,
            isContact: newContact.isContact,
            id: newContact.id
          }
          this.dataService.setCurrentContact(contact);
        }
        else {
          if (this.currentContact) {
            const contact: Contact = {
              userName: this.currentContact.userName,
              image: this.currentContact.image,
              email: this.currentContact.email,
              messages: this.currentContact.messages,
              lastMessage: this.currentContact.lastMessage,
              isContact: this.currentContact.isContact || false,
              id: this.currentContact.id
            }
            this.dataService.setCurrentContact(contact);
          }
        }
      }
      else {
        const contact: Contact = {
          userName: this.user.contacts[0]?.userName || this.allUsers[0].userName,
          image: this.user.contacts[0]?.image || this.allUsers[0].image,
          email: this.user.contacts[0]?.email || this.allUsers[0].email,
          messages: this.user.contacts[0]?.messages || [],
          lastMessage: this.user.contacts[0]?.lastMessage || null,
          isContact: this.user.contacts[0]?.isContact || false,
          id: this.user.contacts[0]?.id || this.allUsers[0].id
        }
        this.dataService.setCurrentContact(contact);
      }

    }, (e) => {
      alert(e);
    });
  }

  updateUserData(): void {
    const data = {
      id: this.user.id,
      userName: this.userName,
      email: this.email,
      image: this.image,
      contacts: this.user.contacts
    }
    this.dataService.update(this.user.id, data);
    this.openEditModal();
    localStorage.setItem('user', JSON.stringify(data));
    this.getUserData();
  }

  signOut(): void {
    this.dataService.signOut();
  }

  openEditModal(): void {
    this.closeSideBar();
    this.display === "none" ? this.display = "block" : this.display = "none";
    this.userName = this.user.userName;
    this.email = this.user.email;
    this.image = this.user.image;
  }

  chooseContact(event): void {
    this.currentContact = this.allUsers.find(el => el.id === event.currentTarget.id);
    if (!this.currentContact) {
      this.currentContact = this.user.contacts.find(el => el.id === event.currentTarget.id);
    }
    const contact: Contact = {
      userName: this.currentContact.userName,
      image: this.currentContact.image,
      email: this.currentContact.email,
      messages: this.currentContact.messages,
      lastMessage: this.currentContact.lastMessage,
      isContact: this.currentContact.isContact,
      id: this.currentContact.id
    }
    this.dataService.setCurrentContact(contact);
  }
}
