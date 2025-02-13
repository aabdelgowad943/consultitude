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
  CodeVerification,
  PasswordSetup,
  UserProfile,
  Completion,
}

@Component({
  selector: 'app-register',
  imports: [NavbarComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  verificationCode: string = '';
  name: string = '';
  currentRole: string = '';
  currentStep: RegistrationStep = RegistrationStep.EmailEntry;
  registrationStep = RegistrationStep;

  emailError: string = '';
  verificationCodeError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(private authService: AuthService) {}

  checkEmail() {
    if (!this.email) {
      this.emailError = 'Email is required';
    } else {
      this.emailError = '';
      this.currentStep = RegistrationStep.CodeVerification;
    }
  }

  verifyCode() {
    if (!this.verificationCode) {
      this.verificationCodeError = 'Verification code is required';
    } else if (this.verificationCode !== '12') {
      this.verificationCodeError = 'Invalid verification code';
    } else {
      this.verificationCodeError = '';
      this.currentStep = RegistrationStep.PasswordSetup;
    }
  }

  setupPassword() {
    if (!this.password) {
      this.passwordError = 'Password is required';
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
    } else {
      this.passwordError = '';
      this.confirmPasswordError = '';
      this.currentStep = RegistrationStep.UserProfile;
    }
  }

  completeRegistration() {
    const registerData: Register = {
      email: this.email,
      password: this.password,
      name: this.name,
      currentRole: this.currentRole,
    };

    this.authService.register(registerData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.currentStep = RegistrationStep.Completion;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }

  goBack() {
    if (this.currentStep > RegistrationStep.EmailEntry) {
      this.currentStep--;
    }
  }
}
