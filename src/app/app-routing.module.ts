import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserGuard } from './guards/user.guard';
import { AuthComponent } from './login/auth/auth.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  {
    path: 'main', component: HomeComponent, canActivate: [UserGuard], children: [
      { path: ':username', component: HomeComponent },
    ]
  },
  { path: 'login', component: AuthComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
