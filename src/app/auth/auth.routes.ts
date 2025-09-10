// src/app/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { OtpComponent } from './pages/otp/otp';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'otp', component: OtpComponent },

];
