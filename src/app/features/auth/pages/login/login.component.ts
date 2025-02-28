import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { GlobalStateService } from '../../../../../shared/services/global-state.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailExists: boolean = false;
  showPasswordInput: boolean = false;
  passwordFieldType: string = 'password';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private globalStateService: GlobalStateService
  ) {}

  login() {
    const loginData: Login = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        if (!res.data.token) {
          this.errorMessage = 'Login failed: No token received';
          return;
        }

        const token = res.data.token;
        if (!token.startsWith('Bearer ')) {
          this.errorMessage = 'Invalid token format';
          return;
        }

        // Set token and user id
        localStorage.setItem('token', token);
        const userId = this.authService.getTokenData();
        if (!userId) {
          this.errorMessage = 'Invalid token data';
          return;
        }
        localStorage.setItem('userId', userId);

        // Use take(1) to only subscribe to the current pending value
        this.globalStateService.pendingPurchase$
          .pipe(take(1))
          .subscribe((pendingId) => {
            if (pendingId) {
              this.router.navigate(['/knowledge/checkout', pendingId]);
              this.globalStateService.clearPendingPurchase();
            } else {
              this.router.navigate(['/dashboard']);
            }
          });
      },
      error: (err: HttpErrorResponse) => {
        if (err.error.isLogin === false) {
          localStorage.setItem('email', this.email);
          this.router.navigate(['/auth/active-email']);
          console.log('email', this.email);
        }

        this.errorMessage =
          err.error?.errors?.[0]?.message || 'An error occurred during login';
      },
    });
  }

  goBack() {
    this.showPasswordInput = false;
    this.emailExists = false;
    this.email = '';
    this.password = '';
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  loginWithLinkedIn() {
    window.location.href = 'http://13.51.183.148:3000/auth/linkedin';
  }
}
