import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FontSize } from '../classes/fontSize.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public mainColor = new Subject<string>();
  public mainHeadColor = new Subject<string>();
  public mainTextColor = new Subject<string>();
  public currentElement = new Subject<string>();
  public backgroundImage = new Subject<string>();
  public fontSize = new Subject<FontSize>();

  constructor() { }

  setMainHeadColor(color: string): void {
    this.mainHeadColor.next(color);
  }

  setMainColor(color: string): void {
    this.mainColor.next(color);
  }

  setMainTextColor(color: string): void {
    this.mainTextColor.next(color);
  }

  setCurrentElement(str: string): void {
    this.currentElement.next(str);
  }

  setChatBackgroundImage(back: string): void {
    this.backgroundImage.next(back);
  }

  setFontSize(size: FontSize): void {
    this.fontSize.next(size);
  }
}
