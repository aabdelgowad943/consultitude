import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showSuccessPopup: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  saveNewPassword() {
    if (this.newPassword === this.confirmPassword) {
      // Simulate saving the new password
      this.showSuccessPopup = true; // Show success popup
      this.newPassword = '';
      this.confirmPassword = '';
      this.errorMessage = ''; // Clear error message
    } else {
      this.errorMessage = 'Passwords do not match';
    }
  }

  goToLogin() {
    this.showSuccessPopup = false;
    window.location.href = '/auth/login'; // Redirect to login page
  }
}
