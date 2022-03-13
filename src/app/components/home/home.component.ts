import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Contact } from 'src/app/classes/contact.model';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { DataService } from 'src/app/services/data.service';
import { ajax } from 'rxjs/internal-compatibility';
import { IMessage } from 'src/app/interfaces/message.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ClearHistoryModalComponent } from '../clear-history-modal/clear-history-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  left: string = '-300px';
  isDark: boolean = false;
  bgColorHead: string = 'slategrey';
  bgColor: string = '#fefefe';
  user: IUserData;
  search: string = '';
  display: string = 'none';
  textColor: string = '#000';
  image: string = '';
  userName: string = '';
  email: string = '';
  changeLang: boolean = false;
  currentElement: string = 'url(../../../assets/icons/close.svg)';
  allUsers = [];
  all = [];
  lang: string = 'en';
  isClick: string = 'none';
  message: string;
  messages = [];
  currentMessageId: number;
  currentContact: Contact;
  isContact: boolean = true;
  urlName: string;
  currentUser: IUserData;
  isString: boolean = true;
  data = [];
  currentMessageIDHTML = '';
  currentDocument;
  editMess = false;

  constructor(private dataService: DataService, private translate: TranslateService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserData();
    this.getAllUsers();
    this.dataService.mainColor.subscribe(data => this.bgColor = data);
    this.dataService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.dataService.mainTextColor.subscribe(data => this.textColor = data);
    this.dataService.currentElement.subscribe(data => this.currentElement = data);
    this.currentUser = JSON.parse(localStorage.getItem('contact'));
  }

  openUserInfo(): void {
    this.isClick === 'none' ? this.isClick = 'flex' : this.isClick = 'none';
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
      this.dataService.setMainHeadColor('slategrey');
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
      this.all = this.allUsers;
      this.user = this.allUsers.find(el => el.id === this.user.id);
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
        this.urlName = this.router.url.slice(6, this.router.url.length);
        if (this.user.contacts.find(el => el.userName === this.urlName)) {
          this.user.contacts.forEach(el => {
            if (el.userName === this.urlName) {
              this.currentContact = {
                userName: el.userName,
                image: el.image,
                email: el.email,
                messages: el.messages,
                lastMessage: el.lastMessage,
                isContact: el.isContact,
                id: el.id
              };
            }
          })
        }
        else {
          const elem = this.allUsers.find(el => el.userName === this.urlName)
          this.allUsers.forEach(el => {
            if (el.userName === this.urlName) {
              this.currentContact = {
                userName: elem.userName,
                image: elem.image,
                email: elem.email,
                messages: [],
                lastMessage: null,
                isContact: false,
                id: elem.id
              };
            }
          });
        }
      }
      else {
        this.currentContact = {
          userName: this.user.contacts[0]?.userName || this.allUsers[0].userName,
          image: this.user.contacts[0]?.image || this.allUsers[0].image,
          email: this.user.contacts[0]?.email || this.allUsers[0].email,
          messages: this.user.contacts[0]?.messages || [],
          lastMessage: this.user.contacts[0]?.lastMessage || null,
          isContact: this.user.contacts[0]?.isContact || false,
          id: this.user.contacts[0]?.id || this.allUsers[0].id
        };
        this.urlName = this.currentContact.userName;
        this.router.navigateByUrl(`main/${this.urlName}`);
      }
      this.isContact = this.currentContact.isContact;
      this.messages = this.user.contacts.find(el => el.id === this.currentContact.id)?.messages || [];
      this.isString = typeof this.messages[0]?.date === 'string';
      this.all.forEach(contact => {
        if (contact.id === this.currentContact.id) {
          this.currentUser = contact;
          localStorage.setItem('contact', JSON.stringify(this.currentUser));
        }
      });
      this.currentMessageId = this.messages.length >= 1 ? this.messages[this.messages.length - 1]?.id + 1 : 0;
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
    localStorage.removeItem('contact');
  }

  openEditModal(): void {
    this.closeSideBar();
    this.display === "none" ? this.display = "block" : this.display = "none";
    this.userName = this.user.userName;
    this.email = this.user.email;
    this.image = this.user.image;
  }

  chooseContact(event): void {
    const contact = this.user.contacts.find(el => el.id === event.currentTarget.id);
    if (contact) {
      this.user.contacts.forEach(el => {
        if (el.id === event.currentTarget.id) {
          this.currentContact = {
            userName: el.userName,
            image: el.image,
            email: el.email,
            messages: el.messages,
            lastMessage: el.lastMessage,
            isContact: el.isContact,
            id: el.id
          };
        }
      })
    }
    else {
      const contact = this.allUsers.find(el => el.id === event.currentTarget.id);
      this.allUsers.forEach(el => {
        if (el.id === event.currentTarget.id) {
          this.currentContact = {
            userName: contact.userName,
            image: contact.image,
            email: contact.email,
            messages: [],
            lastMessage: null,
            isContact: false,
            id: contact.id
          };
        }
      });
    }
    this.isContact = this.currentContact.isContact;
    this.messages = this.user.contacts.find(el => el.id === this.currentContact.id)?.messages || [];
    this.isString = typeof this.messages[0]?.date === 'string'
    this.all.forEach(contact => {
      if (contact.id === this.currentContact.id) {
        this.currentUser = contact;
        localStorage.setItem('contact', JSON.stringify(this.currentUser));
      }
    });
    this.currentMessageId = this.messages.length >= 1 ? this.messages[this.messages.length - 1]?.id + 1 : 0;
  }

  addContact(): void {
    this.currentContact.isContact = true;
    if (this.currentContact.messages.length == 0 && !this.currentContact.lastMessage) {
      this.currentContact.messages = [];
      this.currentContact.lastMessage = {
        id: 0,
        userId: this.currentContact.id,
        message: '',
        date: null,
        edited: false
      }
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
    this.updateInfo(this.user);

    curContact.contacts.push(curUser);
    this.currentUser = curContact;
    this.updateInfo(curContact);
  }

  updateInfo(user: IUserData): void {
    const data = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      image: user.image,
      contacts: user.contacts || []
    }

    this.dataService.update(user.id, data);
    if (user.id == this.user.id) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    else {
      localStorage.setItem('contact', JSON.stringify(data));
    }
  }

  translateMessage(sourceText: string, id: string): void {
    if (!this.data[id]) {
      this.data[id] = document.querySelector(`#mes${id}`).textContent;
      this.getJSON(sourceText, this.lang).subscribe((data) => {
        document.querySelector(`#mes${id}`).textContent = data[0][0][0];
      });
      (document.querySelector(`#ch${id}`) as HTMLElement).style.display = 'block';
    }
    else {
      document.querySelector(`#mes${id}`).textContent = this.data[id];
      (document.querySelector(`#ch${id}`) as HTMLElement).style.display = 'none';
      this.data[id] = '';
    }
  }

  public getJSON(sourceText: string, lang: string): Observable<any> {
    if (lang === 'ua') {
      return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=en&dt=t&q=' + encodeURI(sourceText));
    }
    return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=' + encodeURI(sourceText));
  }

  sendMessage(): void {
    if (!this.editMess) {
      if (this.message) {
        let count = 0;
        const all = this.user.contacts.length;
        const mess = {
          id: this.currentMessageId,
          userId: this.user.id,
          message: this.message,
          date: new Date(),
          edited: false
        };

        this.currentContact.messages.push(mess);
        this.currentContact.lastMessage = mess;

        if (this.user.contacts.length > 0) {
          this.user.contacts.forEach(contact => {
            if (contact.id === this.currentContact.id) {
              contact.messages = this.currentContact.messages;
              contact.lastMessage = this.currentContact.lastMessage;
              this.currentUser.contacts.forEach(el => {
                if (el.id === this.user.id) {
                  el.messages = this.currentContact.messages;
                  el.lastMessage = this.currentContact.lastMessage;
                  localStorage.setItem('contact', JSON.stringify(this.currentUser));
                }
              });
            }
            else {
              count++
            }
          })
        }
        else {
          count = all;
        }
        const contact = JSON.parse(localStorage.getItem('contact'));
        if (this.currentUser === undefined) {
          this.currentUser = {
            userName: this.currentContact.userName,
            image: this.currentContact.image,
            email: this.currentContact.email,
            contacts: contact.contacts,
            id: this.currentContact.id
          }
        }
        if (count == all) {
          this.addContact();
          this.user.contacts.forEach(contact => {
            if (contact.id === this.currentContact.id) {
              contact.messages = this.currentContact.messages;
              contact.lastMessage = this.currentContact.lastMessage;
            }
          })
        }
        this.updateInfo(this.user);
        this.updateInfo(this.currentUser);
        this.message = '';
        this.currentMessageId++;
      }      
    }
    else {
      this.messages.forEach(el => {
        if (el.id === +this.currentMessageIDHTML) {
          el.message = this.message;
          el.edited = true;
        }
      })

      this.currentContact.messages = this.messages;
      this.user.contacts.forEach(contact => {
        if (contact.id === this.currentContact.id) {
          contact.messages = this.currentContact.messages;
          this.currentUser.contacts.forEach(el => {
            if (el.id === this.user.id) {
              el.messages = this.currentContact.messages;
              localStorage.setItem('contact', JSON.stringify(this.currentUser));
            }
          });
        }
      });
      this.updateInfo(this.user);
      this.updateInfo(this.currentUser);
      this.message = '';
      this.editMess = false;
    }
  }

  openMessageSettings(id: string): void {
    if ((document.querySelector(`#m${id}`) as HTMLElement).style.visibility === "unset") {
      (document.querySelector(`#m${id}`) as HTMLElement).style.visibility = "hidden";
    } else {
      this.currentMessageIDHTML = `${id}`;
      (document.querySelector(`#m${id}`) as HTMLElement).style.visibility = "unset";
    }
  }

  onClickedOutside(e: Event): void {
    if (e.target !== document.querySelector(`#dot${this.currentMessageIDHTML}`) && this.currentMessageIDHTML && document.querySelector(`#m${this.currentMessageIDHTML}`)) {
      (document.querySelector(`#m${this.currentMessageIDHTML}`) as HTMLElement).style.visibility = "hidden";
    }
  }

  uploadFile(): void {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', event => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      const uploadData = new FormData();
      uploadData.append('upload_file', selectedFile, selectedFile.name);
      this.currentDocument = uploadData;
      console.log(selectedFile);
      (document.querySelector('.file') as HTMLElement).style.display = 'block';
      // непосредственно отправить файл (post запрос)
      fileInput = null;
    });
    fileInput.click();
  }

  editMessage(mess: IMessage): void {
    this.message = mess.message;
    (document.querySelector('#message') as HTMLInputElement).focus();
    this.editMess = true;
  }

  cancelEdit(): void {
    this.message = '';
    this.editMess = false;
  }

  openDialog(mess: IMessage): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'deleteMessage-matDialog-styles';

    dialogConfig.data = {
      user: this.currentUser,
      messageID: mess.id,
      messages: this.messages,
      myUser: this.user,
      updateInfo: this.updateInfo,
      lastMessage: this.messages[this.messages.length - 1]
    }
    this.dialog.open(DeleteModalComponent, dialogConfig);
  }

  clearHistory(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'clearHistory-matDialog-styles';

    dialogConfig.data = {
      user: this.currentUser,
      myUser: this.user,
      updateInfo: this.updateInfo
    }
    this.dialog.open(ClearHistoryModalComponent, dialogConfig);
    this.openUserInfo();
  }
}
