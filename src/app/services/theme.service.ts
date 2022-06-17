import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FontSize } from '../classes/fontSize.model';
import { Theme } from '../classes/theme.model';

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
  public defaultBackground: string = 'https://firebasestorage.googleapis.com/v0/b/clearchat-e1062.appspot.com/o/image%2Fmobile-apps-pattern-260nw-362377472.webp?alt=media&token=3f4cb8a8-6713-43e5-a206-9f5259cf2b65';
  public light: Theme = {
    isDark: false,
    mainColor: "#fefefe",
    mainHeadColor: "slategrey",
    mainTextColor: "#000",
    currentElement: "url(../../../assets/icons/close.svg)"
  };
  public dark: Theme = {
    isDark: true,
    mainColor: "#3C3B3F",
    mainHeadColor: "#141E30",
    mainTextColor: "#fff",
    currentElement: "url(../../../assets/icons/closeW.svg)"
  }

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
