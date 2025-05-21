import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-otp',
  imports: [NavbarComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showSuccessPopup: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.otp = params['otp'];
    });
    // console.log(this.email);
    // console.log(this.otp);
  }

  saveNewPassword() {
    if (this.newPassword === this.confirmPassword) {
      this.authService
        .confirmResetPassword({
          email: this.email,
          otp: this.otp,
          newPassword: this.newPassword,
        })
        .subscribe({
          next: (res: any) => {
            // Simulate saving the new password
            this.showSuccessPopup = true; // Show success popup
            this.newPassword = '';
            this.confirmPassword = '';
            this.errorMessage = ''; // Clear error message
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = err.error.message;
            // console.log(err);
          },
        });
    } else {
      this.errorMessage = 'Passwords do not match';
    }
  }

  goToLogin() {
    this.showSuccessPopup = false;
    window.location.href = '/auth/login'; // Redirect to login page
  }
}
