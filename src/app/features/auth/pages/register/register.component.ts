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
  registrationError: string = '';
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

    this.authService.isEmailExist(this.email).subscribe({
      next: (res: any) => {
        this.emailError = 'Email already exists';
      },
      error: () => {
        this.emailError = '';
        this.currentStep = RegistrationStep.UserProfile;
      },
    });
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
  validatePassword(): boolean {
    let isValid = true;

    // Reset previous errors
    this.passwordError = '';
    this.confirmPasswordError = '';

    if (!this.password) {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
      isValid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    return isValid;
  }

  // Step 4: Final submission
  verifyAndSubmit() {
    if (this.currentStep === RegistrationStep.CodeVerification) {
      this.authService
        .verifyEmail({
          email: this.email,
          otp: this.verificationCode,
        })
        .subscribe({
          next: (res) => {
            this.currentStep = RegistrationStep.Completion;
          },
          error: (err) => {
            this.verificationCodeError = 'Invalid verification code';
          },
        });
    } else {
      // Validate password fields before proceeding
      const isPasswordValid = this.validatePassword();
      if (!isPasswordValid) {
        return; // Stop if validation fails
      }
      this.registrationError = '';
      const registerData = {
        firstName: this.name,
        lastName: '',
        profileUrl: 'placeholder.com',
        title: this.currentRole,
        email: this.email,
        password: this.password,
      };
      this.authService.register(registerData).subscribe({
        next: (res) => {
          this.currentStep = RegistrationStep.CodeVerification;
        },
        error: (err: HttpErrorResponse) => {
          this.registrationError =
            err.error.message ||
            'Registration failed. Please check your details.';
        },
      });
    }
  }

  isEmailExist() {
    this.authService.isEmailExist(this.email).subscribe({
      next: (res: any) => {
        console.log(res.message);
      },
    });
  }

  goBack() {
    if (this.currentStep > RegistrationStep.EmailEntry) {
      this.currentStep--;
      // Reset relevant errors
      this.registrationError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
    }
  }
}
