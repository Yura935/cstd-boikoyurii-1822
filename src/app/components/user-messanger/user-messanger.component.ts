import { Component, OnInit } from '@angular/core';
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
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.dataService.mainColor.subscribe(data => this.bgColor = data);
    this.dataService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.dataService.mainTextColor.subscribe(data => this.textColor = data);
    this.dataService.currentElement.subscribe(data => this.currentElement = data);
    this.dataService.currentContact.subscribe(data => {
      this.currentContact = data;
      this.isContact = this.currentContact.isContact;
    });
  }

  openUserInfo(): void {
    this.isClick === 'none' ? this.isClick = 'flex' : this.isClick = 'none';
  }

  addContact(): void {
    this.currentContact.isContact = true;
    this.currentContact.messages = [];
    this.currentContact.lastMessage = {
      id: '',
      userName: this.currentContact.userName,
      message: '',
      date: null
    }
    this.user.contacts.push(this.currentContact);

    const data = {
      id: this.user.id,
      userName: this.user.userName,
      email: this.user.email,
      image: this.user.image,
      contacts: this.user.contacts
    }
    this.dataService.update(this.user.id, data);
    localStorage.setItem('user', JSON.stringify(data));
    this.dataService.setAdding(true);
  }
}
