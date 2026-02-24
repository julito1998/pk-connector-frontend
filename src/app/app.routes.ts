import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { authGuard } from './auth/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
