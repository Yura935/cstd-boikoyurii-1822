import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMessage } from 'src/app/interfaces/message.interface';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-clear-history-modal',
  templateUrl: './clear-history-modal.component.html',
  styleUrls: ['./clear-history-modal.component.scss']
})
export class ClearHistoryModalComponent implements OnInit {
  user: IUserData;
  currentUser: IUserData;
  currentUserName: string = '';
  update;
  isCheck: boolean = false;
  lastMessage: IMessage;

  constructor(private dataService: DataService, public dialogRef: MatDialogRef<ClearHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: IUserData,
      myUser: IUserData,
      updateInfo
    }) { }

  ngOnInit(): void {
    this.user = this.data.myUser;
    this.currentUser = this.data.user;
    this.update = this.data.updateInfo;
    this.currentUserName = this.currentUser.userName;
    this.lastMessage = {
      id: 0,
      userId: this.user.id,
      message: '',
      date: null,
      edited: false
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleCheck(): void {
    this.isCheck = !this.isCheck;
  }

  clear(): void {
    if (this.isCheck) {
      for (let i = 0; i < this.user.contacts.length; i++) {
        if (this.user.contacts[i].id === this.data.user.id) {
          this.user.contacts[i].messages = [];
          this.user.contacts[i].lastMessage = this.lastMessage;
        }
      }
      for (let i = 0; i < this.currentUser.contacts.length; i++) {
        if (this.currentUser.contacts[i].id === this.user.id) {
          this.currentUser.contacts[i].messages = [];
          this.currentUser.contacts[i].lastMessage = this.lastMessage;
        }
      }

      this.update(this.user);
      this.update(this.currentUser);
      this.onNoClick();
    }
    else {
      for (let i = 0; i < this.user.contacts.length; i++) {
        if (this.user.contacts[i].id === this.data.user.id) {
          this.user.contacts[i].messages = [];
          this.user.contacts[i].lastMessage = this.lastMessage;
        }
      }

      this.update(this.user);
      this.onNoClick();
    }
  }
}
