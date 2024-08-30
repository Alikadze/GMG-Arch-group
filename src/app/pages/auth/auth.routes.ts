import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'GMG Arch group | Login'
  }
];
