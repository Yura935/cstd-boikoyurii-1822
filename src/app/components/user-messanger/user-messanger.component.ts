import { Component, OnInit } from '@angular/core';
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
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.mainColor.subscribe(data => this.bgColor = data);
    this.dataService.mainHeadColor.subscribe(data => this.bgColorHead = data);
    this.dataService.mainTextColor.subscribe(data => this.textColor = data);
    this.dataService.currentElement.subscribe(data => this.currentElement = data);
  }

  openUserInfo(): void {
    this.isClick === 'none' ? this.isClick = 'flex' : this.isClick = 'none';
  }
}
