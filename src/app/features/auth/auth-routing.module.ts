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
    path: 'login-------wdsadjkhhjads',
    component: LoginComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'registerdsahdjksadhjksa',
    component: RegisterComponent,
    canActivate: [NonAuthGuard],
  },
  {
    path: 'rest-passworddjksahdkjsah',
    component: ResetPasswordComponent,
  },
  {
    path: 'reset-passwordsadkjsadjhsakj',
    component: VerifyOtpComponent,
  },
  { path: 'linkedin/callbackdsajkdhsa', component: LinkedinCallbackComponent },
  {
    path: 'active-emaildkhsakdjsa',
    component: ActiveEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
