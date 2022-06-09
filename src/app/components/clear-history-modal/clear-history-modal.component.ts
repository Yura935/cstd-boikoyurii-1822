import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FontSize } from 'src/app/classes/fontSize.model';
import { IMessage } from 'src/app/interfaces/message.interface';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { ThemeService } from 'src/app/services/theme.service';

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
  currentSize: FontSize;

  constructor(public dialogRef: MatDialogRef<ClearHistoryModalComponent>,
    private themeService: ThemeService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: IUserData,
      myUser: IUserData,
      updateInfo
    }) { }

  ngOnInit(): void {
    this.currentSize = JSON.parse(localStorage.getItem('fontSize'));
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
