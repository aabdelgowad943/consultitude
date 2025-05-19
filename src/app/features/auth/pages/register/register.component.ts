import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

enum RegistrationStep {
  EmailEntry,
  UserProfile,
  PasswordSetup,
  CodeVerification,
  Completion,
}

@Component({
  selector: 'app-register',
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  // Form groups for different steps
  emailForm!: FormGroup;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  verificationForm!: FormGroup;

  // Step management
  currentStep: RegistrationStep = RegistrationStep.EmailEntry;
  registrationStep = RegistrationStep;

  // Error messages
  registrationError: string = '';
  verificationCodeError: string = '';

  // User data for completion
  userName: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  // Initialize all form groups with validators
  initializeForms(): void {
    // Email form with pattern validation
    this.emailForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });

    // Profile form with name length validation
    this.profileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]+$'),
        ],
      ],
      currentRole: ['', [Validators.required, Validators.maxLength(50)]],
    });

    // Password form with custom validator for matching passwords
    this.passwordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            // Password pattern: at least one uppercase, one lowercase, one number and one special character
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Verification form with pattern for numeric code
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required]],
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // Step 1: Email validation and check if exists
  checkEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.get('email')?.value;

    this.authService.isEmailExist(email).subscribe({
      next: () => {
        // Email exists - show error
        this.emailForm.get('email')?.setErrors({ emailExists: true });
      },
      error: () => {
        // Email doesn't exist - proceed to next step
        this.currentStep = RegistrationStep.UserProfile;
      },
    });
  }

  // Step 2: Profile validation
  validateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.userName = this.profileForm.get('name')?.value;
    this.currentStep = RegistrationStep.PasswordSetup;
  }

  // Step 3: Move to verification step after creating account
  submitRegistration(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const registerData = {
      firstName: this.profileForm.get('name')?.value,
      lastName: '',
      profileUrl:
        'https://consultittude.s3.eu-north-1.amazonaws.com/a62b161c-7f95-4f83-aa6c-715e455852a9-307ce493-b254-4b2d-8ba4-d12c080d6651.jpg',
      title: this.profileForm.get('currentRole')?.value,
      email: this.emailForm.get('email')?.value,
      password: this.passwordForm.get('password')?.value,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.currentStep = RegistrationStep.CodeVerification;
      },
      error: (err: HttpErrorResponse) => {
        this.registrationError =
          err.error.message ||
          'Registration failed. Please check your details.';
      },
    });
  }

  // Step 4: Verify email with OTP
  verifyEmail(): void {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }

    this.authService
      .verifyEmail({
        email: this.emailForm.get('email')?.value,
        otp: this.verificationForm.get('verificationCode')?.value,
      })
      .subscribe({
        next: () => {
          this.currentStep = RegistrationStep.Completion;
        },
        error: () => {
          this.verificationCodeError = 'Invalid verification code';
        },
      });
  }

  // Go back one step
  goBack(): void {
    if (this.currentStep > RegistrationStep.EmailEntry) {
      this.currentStep--;
      this.registrationError = '';
    }
  }

  // Resend verification code
  resendCode(): void {
    // Implement resend functionality here
    // This would typically call an API endpoint to resend the code
  }

  // Helper methods for template
  get currentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case RegistrationStep.EmailEntry:
        return this.emailForm;
      case RegistrationStep.UserProfile:
        return this.profileForm;
      case RegistrationStep.PasswordSetup:
        return this.passwordForm;
      case RegistrationStep.CodeVerification:
        return this.verificationForm;
      default:
        return this.emailForm;
    }
  }
}
