import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { Contact } from 'src/app/classes/contact.model';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { DataService } from 'src/app/services/data.service';
import { ajax } from 'rxjs/internal-compatibility';
import { IMessage } from 'src/app/interfaces/message.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ClearHistoryModalComponent } from '../clear-history-modal/clear-history-modal.component';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { AngularFireStorage } from '@angular/fire/storage';
import { ThemeService } from 'src/app/services/theme.service';
import { FontSize } from 'src/app/classes/fontSize.model';
import { File } from 'src/app/classes/file.model';
import { UserData } from 'src/app/classes/userData.model';
import { Message } from 'src/app/classes/message.model';
import { Theme } from 'src/app/classes/theme.model';
import { Translation } from 'src/app/classes/translation.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroll') private myScrollContainer: ElementRef;
  public left: boolean = false;
  public isDark: boolean;
  public bgColorHead: string;
  public bgColor: string;
  public user: IUserData;
  public search: string;
  public display: string = 'none';
  public textColor: string;
  public image: string;
  userName: string;
  email: string;
  currentElement: string;
  allUsers = [];
  all: Array<UserData> = [];
  lang: string = 'en';
  isClick: string = 'none';
  message: string;
  messages: Array<Message> = [];
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
  transLang: Translation;
  theme: Theme;
  backgroundImage: string;
  currentSize: FontSize;
  urlFile: File;
  destroy$: Subject<any> = new Subject();

  constructor(
    private dataService: DataService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private filter: FilterPipe,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getUserData();
    this.getAllUsers();
    this.getThemeElements();
    this.currentUser = JSON.parse(localStorage.getItem('contact'));
    if (!localStorage.getItem('transLang')) {
      this.transLang = { from: "en", to: "uk" };
      localStorage.setItem('transLang', JSON.stringify(this.transLang));
    }
    else {
      this.transLang = JSON.parse(localStorage.getItem('transLang'));
    }
    this.currentSize = JSON.parse(localStorage.getItem('fontSize'));

    this.checkFilter();
    this.themeInit();
    this.themeService.backgroundImage
      .subscribe(data => {
        if (data) {
          this.backgroundImage = data;
        }
      });
    if (!localStorage.getItem('currentLanguage')) {
      localStorage.setItem('currentLanguage', JSON.stringify(this.lang));
    }
    else {
      this.lang = JSON.parse(localStorage.getItem('currentLanguage'));
      this.translate.use(this.lang);
    }
    this.themeService.fontSize.subscribe(data => {
      if (data) {
        this.currentSize = data;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  themeInit(): void {
    this.theme = JSON.parse(localStorage.getItem('theme'));
    this.isDark = this.theme.isDark;
    this.themeService.setMainColor(this.theme.mainColor);
    this.themeService.setMainHeadColor(this.theme.mainHeadColor);
    this.themeService.setMainTextColor(this.theme.mainTextColor);
    this.themeService.setCurrentElement(this.theme.currentElement);
  }

  getThemeElements(): void {
    this.themeService.mainColor.subscribe(data => this.bgColor = data);
    this.themeService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.themeService.mainTextColor.subscribe(data => this.textColor = data);
    this.themeService.currentElement.subscribe(data => this.currentElement = data);
  }

  openUserInfo(): void {
    this.isClick === 'none' ? this.isClick = 'flex' : this.isClick = 'none';
  }

  toggleSidebar(): void {
    this.left = !this.left;
  }

  toggleView(): void {
    this.isDark = !this.isDark;
    this.theme = this.isDark ? this.themeService.dark : this.themeService.light;
    localStorage.setItem('theme', JSON.stringify(this.theme));
    this.themeService.setMainColor(this.theme.mainColor);
    this.themeService.setMainHeadColor(this.theme.mainHeadColor);
    this.themeService.setMainTextColor(this.theme.mainTextColor);
    this.themeService.setCurrentElement(this.theme.currentElement);
  }

  getUserData(): void {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.backgroundImage = this.user.backgroundChat;
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
      takeUntil(this.destroy$)
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
          userName: this.user.contacts[0]?.userName || this.allUsers[0]?.userName,
          image: this.user.contacts[0]?.image || this.allUsers[0]?.image,
          email: this.user.contacts[0]?.email || this.allUsers[0]?.email,
          messages: this.user.contacts[0]?.messages || [],
          lastMessage: this.user.contacts[0]?.lastMessage || null,
          isContact: this.user.contacts[0]?.isContact || false,
          id: this.user.contacts[0]?.id || this.allUsers[0]?.id
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
    const data: UserData = {
      id: this.user.id,
      userName: this.userName,
      email: this.email,
      image: this.image,
      contacts: this.user.contacts,
      backgroundChat: this.user.backgroundChat
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
    this.left = false;
    this.display === "none" ? this.display = "flex" : this.display = "none";
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
        file: {
          url: '',
          name: ''
        },
        edited: false
      }
    }

    const curContact = {
      userName: this.currentContact.userName,
      image: this.currentContact.image,
      email: this.currentContact.email,
      contacts: this.currentUser.contacts || [],
      backgroundChat: this.currentUser.backgroundChat || this.themeService.defaultBackground,
      id: this.currentContact.id
    }

    const curUser = {
      ...this.user,
      messages: this.currentContact.messages,
      lastMessage: this.currentContact.lastMessage,
      isContact: true
    }
    delete curUser.contacts;
    delete curUser.backgroundChat;

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
      backgroundChat: user.backgroundChat,
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
      this.getJSON(sourceText, this.transLang.from, this.transLang.to).pipe(
        takeUntil(this.destroy$))
        .subscribe((data) => {
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

  public getJSON(sourceText: string, langFrom: string, langTo: string): Observable<any> {
    return ajax.getJSON(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${langFrom}&tl=${langTo}&dt=t&q=` + encodeURI(sourceText));
  }

  sendMessage(): void {
    if (!this.editMess) {
      if (this.message || this.urlFile) {
        let count = 0;
        const all = this.user.contacts.length;
        const mess = {
          id: this.currentMessageId,
          userId: this.user.id,
          message: this.message || '',
          date: new Date(),
          file: this.urlFile || { url: '', name: '' },
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
            backgroundChat: this.themeService.defaultBackground,
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
        this.urlFile = {
          url: '',
          name: ''
        }
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
          contact.lastMessage = this.currentContact.messages[this.currentContact.messages.length - 1];
          this.currentUser.contacts.forEach(el => {
            if (el.id === this.user.id) {
              el.messages = this.currentContact.messages;
              el.lastMessage = this.currentContact.messages[this.currentContact.messages.length - 1];
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
      const elements = document.getElementsByClassName('settings');
      for (let i = 0; i < elements.length; i++) {
        if (i != +this.currentMessageIDHTML) {
          (elements[i] as HTMLElement).style.visibility = 'hidden';
        }
      }
    }
  }

  onClickedOutside(e: Event): void {
    if (e.target !== document.querySelector(`#dot${this.currentMessageIDHTML}`) && this.currentMessageIDHTML && document.querySelector(`#m${this.currentMessageIDHTML}`)) {
      (document.querySelector(`#m${this.currentMessageIDHTML}`) as HTMLElement).style.visibility = "hidden";
    }
  }

  uploadImage(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().pipe(
        takeUntil(this.destroy$))
        .subscribe(url => {
          this.image = url;
        });
    });
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

  openSettings(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'settings-matDialog-styles';

    dialogConfig.data = {
      myUser: this.user,
    }
    const dialogRef = this.dialog.open(SettingsModalComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.transLang = JSON.parse(localStorage.getItem('transLang'));
      });
    this.toggleSidebar();
  }

  checkFilter(): number {
    return this.filter.transform(this.user.contacts, this.search).length || this.filter.transform(this.allUsers, this.search).length;
  }

  loadFile(event): void {
    const file = event.target ? event.target.files[0] : event;
    console.log(file);

    const path = `files/${file.name}`;
    const upload = this.storage.upload(path, file);

    upload.then(file => {
      this.storage.ref(`files/${file.metadata.name}`).getDownloadURL().pipe(
        takeUntil(this.destroy$))
        .subscribe(url => {
          this.urlFile = {
            url: url,
            name: file.metadata.name
          }
        })
    });
  }

  downloadFile(file: File): void {
    var el = document.createElement('a');
    el.setAttribute('href', file.url);
    el.setAttribute('target', '_blank');
    el.setAttribute('download', file.name);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      alert(err);
    }
  }

  // ngOnDestroy(): void {
  //   this.themeService.mainColor.unsubscribe();
  //   this.themeService.mainHeadColor.unsubscribe();
  //   this.themeService.mainTextColor.unsubscribe();
  //   this.themeService.currentElement.unsubscribe();
  //   this.themeService.backgroundImage.unsubscribe();
  //   this.themeService.fontSize.unsubscribe();
  //   this.destroy$.next();
  //   this.destroy$.unsubscribe();
  // }
}
