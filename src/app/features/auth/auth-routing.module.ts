import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { LinkedinCallbackComponent } from '../../shared/linkedin-callback/linkedin-callback.component';
import { ActiveEmailComponent } from './pages/active-email/active-email.component';
import { AuthGuard } from '../../guard/auth.guard';
import { NonAuthGuard } from '../../guard/non-auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'rest-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'reset-password',
    component: VerifyOtpComponent,
  },
  { path: 'linkedin/callback', component: LinkedinCallbackComponent },
  {
    path: 'active-email',
    component: ActiveEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
