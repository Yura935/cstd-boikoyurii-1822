import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FontSize } from 'src/app/classes/fontSize.model';
import { IUserData } from 'src/app/interfaces/userData.interface';
import { DataService } from 'src/app/services/data.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {
  openLang: boolean = false;
  transLang;
  background: string = '';
  isHover: boolean = false;
  defaultBackground: string = 'https://firebasestorage.googleapis.com/v0/b/clearchat-e1062.appspot.com/o/image%2Fmobile-apps-pattern-260nw-362377472.webp?alt=media&token=3f4cb8a8-6713-43e5-a206-9f5259cf2b65';
  changeLang: boolean = false;
  changeSize: boolean = false;
  lang: string = 'en';
  sizes: Array<FontSize> = [
    {
      id: "s1",
      title: "1em",
      text: "12px"
    },
    {
      id: "s2",
      title: "1.4em",
      text: "16px"
    },
    {
      id: "s3",
      title: "1.8em",
      text: "18px"
    }
  ];
  currentSize: FontSize;

  constructor
    (public dialogRef: MatDialogRef<SettingsModalComponent>,
      private dataService: DataService,
      private themeService: ThemeService,
      private storage: AngularFireStorage,
      private translate: TranslateService,
      @Inject(MAT_DIALOG_DATA)
      public data: {
        myUser: IUserData
      }) { }

  ngOnInit(): void {
    this.transLang = JSON.parse(localStorage.getItem('transLang'));
    this.lang = JSON.parse(localStorage.getItem('currentLanguage'));
    this.currentSize = JSON.parse(localStorage.getItem('fontSize'));
  }

  changeLanguage(): void {
    const changeLang = {
      from: this.transLang.to,
      to: this.transLang.from,
    }
    this.transLang = changeLang;
    localStorage.setItem('transLang', JSON.stringify(changeLang));
  }

  changeToggleLanguage(element): void {
    if (element.id === 'en') {
      this.lang = 'en';
      localStorage.setItem('currentLanguage', JSON.stringify(this.lang));
    }
    else {
      this.lang = 'ua';
      localStorage.setItem('currentLanguage', JSON.stringify(this.lang));
    }
  }

  toggleLang(): void {
    this.openLang = !this.openLang;
  }

  toggleChangeSize(): void {
    this.changeSize = !this.changeSize;
  }

  uploadImage(event): void {
    const file = event.target.files[0];
    const filePath = `image/${file.name}`;
    const upload = this.storage.upload(filePath, file);

    upload.then(image => {
      this.storage.ref(`image/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.background = url;
        this.themeService.backgroundImage.next(this.background);

        const user = {
          ...this.data.myUser,
          backgroundChat: this.background
        };
        this.dataService.update(this.data.myUser.id, user);
        localStorage.setItem('user', JSON.stringify(user));
      });
    });

    event.target.value = '';
  };

  default(): void {
    this.themeService.backgroundImage.next(this.defaultBackground);
    const user = {
      ...this.data.myUser,
      backgroundChat: this.defaultBackground
    };

    this.dataService.update(this.data.myUser.id, user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  openLangModal(): void {
    this.changeLang = !this.changeLang;
  }

  setFontSize(event: Event): void {
    this.sizes.forEach(el => {
      if (el.id === (event.target as HTMLElement).id) {
        this.currentSize = el;
      }
    })
    localStorage.setItem('fontSize', JSON.stringify(this.currentSize));
    this.themeService.setFontSize(this.currentSize);
  }
}
