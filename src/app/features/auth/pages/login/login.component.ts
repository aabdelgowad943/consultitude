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
        // Set token and user id
        localStorage.setItem('token', res.data.token);
        const userId = this.authService.getTokenData();
        localStorage.setItem('userId', userId);
        // console.log(res.data);

        // Use take(1) to only subscribe to the current pending value
        this.globalStateService.pendingPurchase$
          .pipe(take(1))
          .subscribe((pendingId) => {
            if (pendingId) {
              // console.log('pending', pendingId);
              // Redirect to checkout using the pending template id
              this.router.navigate(['/knowledge/checkout', pendingId]);
              // Clear the global pending purchase state
              this.globalStateService.clearPendingPurchase();
            } else {
              // Redirect to a default route if no pending purchase
              this.router.navigate(['/dashboard']);
            }
          });
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        this.errorMessage = err.error.errors[0].message;
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
