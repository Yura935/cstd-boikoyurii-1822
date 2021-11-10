import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  dataArray: Array<any> = [];
  currentContact: Object = {};
  left: string = '-300px';
  isDark: boolean = false;
  bgColorHead: string = 'gray';
  bgColor: string = '#fefefe';
  user;
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

  constructor(private dataService: DataService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getUserData();
    this.dataService.mainColor.subscribe(data => this.bgColor = data);
    this.dataService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.dataService.mainTextColor.subscribe(data => this.textColor = data);
    this.dataService.currentElement.subscribe(data => this.currentElement = data);
    this.getAllUsers();
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
      console.log(this.user);
    }
  }

  getAllUsers(): void {
    this.dataService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      ),
      take(2)
    ).subscribe(data => {
      this.allUsers = data;
      this.allUsers = this.allUsers.filter(el => el.id !== this.user.id);
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
  }
}
