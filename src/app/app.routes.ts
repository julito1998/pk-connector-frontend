import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from './auth/guards/auth.guard';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: '', component: UsersComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
