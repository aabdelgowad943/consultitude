import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-active-email',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './active-email.component.html',
  styleUrl: './active-email.component.scss',
})
export class ActiveEmailComponent implements OnInit {
  verificationCode: string = '';
  email: string = '';
  verificationCodeError: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (!this.email) {
      this.router.navigate(['/auth/login']);
    }
  }

  verifyAndSubmit() {
    if (!this.verificationCode) {
      this.verificationCodeError = 'Please enter the verification code';
      return;
    }

    this.isLoading = true;
    this.authService
      .verifyEmail({
        email: this.email,
        otp: this.verificationCode,
      })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.isSuccess = true;
          this.successMessage = response.data.message;
          localStorage.removeItem('email');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.isSuccess = false;
          this.verificationCodeError =
            err.error?.errors?.[0]?.message || 'Invalid verification code';
        },
      });
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }

  resendCode() {
    this.authService
      .resetPassword({
        email: this.email,
      })
      .subscribe({
        next: (response: any) => {
          // console.log(response);

          this.successMessage = response.data.message;
        },
      });
  }
}
