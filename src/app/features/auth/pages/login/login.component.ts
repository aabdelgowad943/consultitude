import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { GlobalStateService } from '../../../../../shared/services/global-state.service';
import { take } from 'rxjs';
import { ProfileServiceService } from '../../../dashboard/services/profile-service.service';

@Component({
  selector: 'app-login',
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  passwordFieldType: string = 'password';
  errorMessage: string = '';
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private profileService: ProfileServiceService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.formSubmitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const loginData: Login = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
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

        this.localStorageStoring(userId);

        // Use take(1) to only subscribe to the current pending value
        this.globalStateService.pendingPurchase$
          .pipe(take(1))
          .subscribe((pendingId) => {
            if (pendingId) {
              this.router.navigate(['/knowledge/checkout', pendingId]);
              this.globalStateService.clearPendingPurchase();
            } else {
              this.router.navigate(['/dashboard/ask-evo']);
            }
          });
      },
      error: (err: HttpErrorResponse) => {
        if (err.error.isLogin === false) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
          this.router.navigate(['/auth/active-email']);
        }

        this.errorMessage =
          err.error?.errors?.[0]?.message || 'An error occurred during login';

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }

  localStorageStoring(userId: string) {
    this.authService.getUserDataByUserId(userId).subscribe({
      next: (res: any) => {
        localStorage.setItem('profileId', res.data.id);
        localStorage.setItem('email', res.data.user.email);
        localStorage.setItem('firstName', res.data.firstName);
        localStorage.setItem('lastName', res.data.lastName);
        localStorage.setItem('profileUrl', res.data.profileUrl);
      },
      complete: () => {},
    });
  }

  goBack() {
    this.loginForm.reset();
    this.formSubmitted = false;
    this.errorMessage = '';
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  loginWithLinkedIn() {
    window.location.href = 'http://13.51.183.148:3000/auth/linkedin';
  }

  // Form field getters
  get emailControl() {
    return this.loginForm.get('email');
  }
  get passwordControl() {
    return this.loginForm.get('password');
  }

  // Field validation methods
  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.formSubmitted)
    );
  }

  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (this.emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (this.passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }
}
