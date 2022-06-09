import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FontSize } from 'src/app/classes/fontSize.model';
import { IMessage } from 'src/app/interfaces/message.interface';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  currentUserName: string = '';
  currentUser: IUserData
  isCheck: boolean = false;
  messageID: number;
  messages = [];
  user: IUserData;
  update;
  lastMessage: IMessage;
  lastMessageDefault: IMessage;
  currentSize: FontSize;

  constructor(public dialogRef: MatDialogRef<DeleteModalComponent>,
    private themeService: ThemeService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: IUserData,
      messageID: number,
      messages: Array<any>,
      myUser: IUserData,
      updateInfo,
      lastMessage: IMessage
    }
  ) { }

  ngOnInit(): void {
    this.currentSize = JSON.parse(localStorage.getItem('fontSize'));
    this.currentUserName = this.data.user.userName;
    this.currentUser = this.data.user;
    this.messageID = this.data.messageID;
    this.messages = this.data.messages;
    this.user = this.data.myUser;
    this.update = this.data.updateInfo;
    this.lastMessage = this.data.lastMessage;
    this.lastMessageDefault = {
      id: 0,
      userId: this.user.id,
      message: '',
      date: null,
      edited: false
    };
    this.themeService.fontSize.subscribe(data => {
      if(data) {
        this.currentSize = data;        
      }
    });    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleCheck(): void {
    this.isCheck = !this.isCheck;
  }

  deleteMesage(): void {
    if (this.isCheck) {
      this.replaceMessages();
      for (let i = 0; i < this.currentUser.contacts.length; i++) {
        if (this.currentUser.contacts[i].id === this.user.id) {
          this.currentUser.contacts[i].messages = this.messages;
          this.currentUser.contacts[i].lastMessage = this.lastMessage;
        }
      }

      this.update(this.user);
      this.update(this.currentUser);
      this.onNoClick();
    }
    else {
      this.replaceMessages();
      this.update(this.user);
      this.onNoClick();
    }
  }

  replaceMessages(): void {
    this.messages.forEach(el => {
      if (el.id === this.messageID && this.lastMessage.id !== this.messageID) {
        const index = this.messages.indexOf(el);
        this.messages.splice(index, 1);
      }
      else if (el.id === this.messageID && this.lastMessage.id === this.messageID) {
        this.messages.pop();
        this.lastMessage = this.messages.length > 1 ? this.messages[this.messages.length - 1] : this.lastMessageDefault;
      }
    });
    for (let i = 0; i < this.user.contacts.length; i++) {
      if (this.user.contacts[i].id === this.data.user.id) {
        this.user.contacts[i].messages = this.messages;
        this.user.contacts[i].lastMessage = this.lastMessage;
      }
    }
  }
}
