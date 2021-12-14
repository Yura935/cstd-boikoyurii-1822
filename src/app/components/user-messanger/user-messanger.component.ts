import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { Contact } from 'src/app/classes/contact.model';
import { UserData } from 'src/app/classes/userData.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-messanger',
  templateUrl: './user-messanger.component.html',
  styleUrls: ['./user-messanger.component.scss']
})
export class UserMessangerComponent implements OnInit {
  bgColorHead: string = 'gray';
  bgColor: string = '#fefefe';
  textColor: string = '#000';
  currentElement: string = 'url(../../../assets/icons/close.svg)';
  isClick: string = 'none';
  currentContact: Contact;
  isContact: boolean = true;
  user: UserData;
  message: string;
  messages = [];
  currentMessageId: number;
  allUsers = [];
  currentUser: UserData;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log(2);
    
    this.user = JSON.parse(localStorage.getItem('user'));
    this.dataService.mainColor.subscribe(data => this.bgColor = data);
    this.dataService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.dataService.mainTextColor.subscribe(data => this.textColor = data);
    this.dataService.currentElement.subscribe(data => this.currentElement = data);
    this.dataService.currentContact.subscribe(data => {
      this.currentContact = data;
      this.isContact = this.currentContact.isContact;
      this.messages = this.currentContact.messages;
    });
    this.currentMessageId = this.currentContact?.messages[this.currentContact?.messages.length - 1]?.id || 0;
    // this.getAllUsers()
    this.dataService.getS().subscribe(data => {
      console.log(data);
    });
    merge(this.dataService.getS()).subscribe(res => {
      console.log(res);
      
    })
  }

  openUserInfo(): void {
    this.isClick === 'none' ? this.isClick = 'flex' : this.isClick = 'none';
  }

  addContact(): void {
    this.currentContact.isContact = true;
    this.currentContact.messages = [];
    this.currentContact.lastMessage = {
      id: 0,
      userId: '',
      message: '',
      date: null
    }
    const curContact = {
      userName: this.currentContact.userName,
      image: this.currentContact.image,
      email: this.currentContact.email,
      contacts: [],
      id: this.currentContact.id
    }
    const curUser = {
      ...this.user,
      messages: this.currentContact.messages,
      lastMessage: this.currentContact.lastMessage,
      isContact: true
    }
    delete curUser.contacts;

    this.user.contacts.push(this.currentContact);
    curContact.contacts.push(curUser);
    this.updateInfo(this.user);
    this.updateInfo(curContact);
    this.dataService.setAdding(true);
  }

  updateInfo(user): void {
    // console.log(user);
    const data = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      image: user.image,
      contacts: user.contacts
    }
    this.dataService.update(user.id, data);
    if (user.id === this.user.id) {
      localStorage.setItem('user', JSON.stringify(data));
    }
  }

  getAllUsers(): void {
    console.log(1);
    
    this.dataService.getAll().ref.get({}).then(data => {
      console.log(data);
      
      // this.allUsers = data;
      this.allUsers = this.allUsers.filter(el => el.id !== this.user.id);
      this.allUsers.forEach(el => {
        if (el.id === this.currentContact.id) {
          this.currentUser = el;
        }
      })
      console.log(2);
      
      // console.log(this.allUsers);
      // console.log(this.currentUser);

    }, (e) => {
      alert(e);
    });
  }

  sendMessage(): void {
    if (this.message) {
      const mess = {
        id: this.currentMessageId,
        userId: this.user.id,
        message: this.message,
        date: new Date()
      };
      // console.log(this.currentContact);
      this.getAllUsers();

      this.currentContact.messages.push(mess);
      this.currentContact.lastMessage = mess;

      if (this.user.contacts.length > 0) {
        this.user.contacts.forEach(contact => {
          if (contact.id === this.currentContact.id) {
            contact.messages = this.currentContact.messages;
            contact.lastMessage = this.currentContact.lastMessage;
          }
          else {
            this.addContact();
          }
        })
      }
      else {
        this.addContact();
        // this.user.contacts.forEach(contact => {
        //   if (contact.id === this.currentContact.id) {
        //     contact.messages = this.currentContact.messages;
        //     contact.lastMessage = this.currentContact.lastMessage;
        //   }
        // })
      }

      // this.updateInfo(this.user);
      // this.updateInfo(this.currentUser);
      this.message = '';
      // console.log(mess);
    }
  }
}
