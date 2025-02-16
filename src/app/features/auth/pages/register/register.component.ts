import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../../models/login';
import { Register } from '../../models/register';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
enum RegistrationStep {
  EmailEntry,
  UserProfile,
  PasswordSetup,
  CodeVerification,
  Completion,
}

@Component({
  selector: 'app-register',
  imports: [NavbarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  // Form fields
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  verificationCode: string = '';
  name: string = '';
  currentRole: string = '';

  // Step management
  currentStep: RegistrationStep = RegistrationStep.EmailEntry;
  registrationStep = RegistrationStep;

  // Error messages
  emailError: string = '';
  nameError: string = '';
  roleError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  verificationCodeError: string = '';

  constructor(private authService: AuthService) {}

  // Step 1: Email validation
  checkEmail() {
    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }
    if (!this.email.includes('@')) {
      this.emailError = 'Please enter a valid email';
      return;
    }
    this.emailError = '';
    this.currentStep = RegistrationStep.UserProfile;
  }

  // Step 2: Profile validation
  validateProfile() {
    if (!this.name) {
      this.nameError = 'Name is required';
      return;
    }
    if (!this.currentRole) {
      this.roleError = 'Current role is required';
      return;
    }
    this.nameError = '';
    this.roleError = '';
    this.currentStep = RegistrationStep.PasswordSetup;
  }

  // Step 3: Password validation
  validatePassword() {
    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }
    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return;
    }
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.currentStep = RegistrationStep.CodeVerification;
  }

  // Step 4: Final submission
  verifyAndSubmit() {
    if (!this.verificationCode) {
      this.verificationCodeError = 'Verification code is required';
      return;
    }
    if (this.verificationCode.length !== 6) {
      this.verificationCodeError = 'Code must be 6 digits';
      return;
    }

    const registerData = {
      email: this.email,
      password: this.password,
      name: this.name,
      currentRole: this.currentRole,
      verificationCode: this.verificationCode,
    };

    this.authService.register(registerData).subscribe({
      next: (res) => {
        this.currentStep = RegistrationStep.Completion;
      },
      error: (err) => {
        this.verificationCodeError = 'Invalid verification code';
      },
    });
  }

  goBack() {
    if (this.currentStep > RegistrationStep.EmailEntry) {
      this.currentStep--;
    }
  }
}
