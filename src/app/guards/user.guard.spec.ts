import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserGuard } from './user.guard';
import { AuthComponent } from '../login/auth/auth.component';

describe('UserGuard', () => {
  let guard: UserGuard;
  let router: Router;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: AuthComponent }]),
        BrowserAnimationsModule]
    });
    guard = TestBed.inject(UserGuard);
    router = TestBed.inject(Router)
  });

  it('should be created', () => {
    guard.canActivate(route, state)
    expect(guard).toBeTruthy();
  });

  it('should check login', () => {
    localStorage.setItem('user', JSON.stringify({ userPos: 'user' }))
    expect(guard.checkLogin()).toBeTruthy();
  });

  it('should check login if local storage is empty', () => {
    localStorage.clear();
    expect(guard.checkLogin()).toBeFalse();
  });
});
