import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  email: string = '';
  password: string = '';
  emailExists: boolean = false;
  showPasswordInput: boolean = false;
  passwordFieldType: string = 'password';
  showPopup: boolean = false;
  showSuccessPopup: boolean = false;
  showNewPasswordInput: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  currentStep: number = 1;

  constructor(private authService: AuthService) {}

  checkEmail() {
    // Simulate an API call to check if the email exists
    if (this.email === 'ahmed@mail.com') {
      this.emailExists = true;
      this.showPasswordInput = true;
      this.showPopup = true; // Show the popup
    } else {
      alert('Email does not exist');
    }
  }

  login() {
    const loginData: Login = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
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

  closePopup() {
    this.showPopup = false;
    this.currentStep = 2; // Move to the next step
  }

  saveNewPassword() {
    if (this.newPassword === this.confirmPassword) {
      // Simulate saving the new password
      this.showSuccessPopup = true; // Show success popup
      this.currentStep = 1; // Reset to the first step
      this.showNewPasswordInput = false;
      this.email = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } else {
      alert('Passwords do not match');
    }
  }

  goToLogin() {
    this.showSuccessPopup = false;
    window.location.href = '/auth/login'; // Redirect to login page
  }
}
