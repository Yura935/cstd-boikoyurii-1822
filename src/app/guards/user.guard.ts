import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NgForage } from 'ngforage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private readonly ngf: NgForage) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin();
  }

  async checkLogin(): Promise<boolean> {
    const value = await this.ngf.getItem('user');
    return Boolean(value);
    // if (localStorage.getItem('user')) {
    //   return true;
    // }
    // this.router.navigate(['/login']);
    // return false;
  }
}
