import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ChangePasswordSettings } from '../../../auth/models/change-password';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsLoaderComponent } from '../../../../shared/loaders/settings-loader/settings-loader.component';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule, SettingsLoaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  isLoading = false;
  settingsForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  userEmail: string = '';
  formSubmitted = false; // Add flag to track form submission

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getUserData();
  }

  getUserData() {
    this.isLoading = true;
    this.authService
      .getUserDataByUserId(localStorage.getItem('userId')!)
      .subscribe({
        next: (res: any) => {
          this.userEmail = res.data.user.email;
          this.settingsForm.get('email')?.setValue(this.userEmail);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
        },
      });
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group(
      {
        // Email field
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],

        // Old Password
        oldPassword: ['', [Validators.required]],

        // New Password
        newPassword: ['', [Validators.required, Validators.minLength(6)]],

        // Repeat New Password
        repeatNewPassword: ['', [Validators.required]],
      },
      {
        // A custom validator to ensure newPassword and repeatNewPassword match
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Custom validator to check if newPassword === repeatNewPassword
  private passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword');
    const repeatNewPassword = formGroup.get('repeatNewPassword');
    if (newPassword?.value !== repeatNewPassword?.value) {
      repeatNewPassword?.setErrors({ passwordMismatch: true });
    } else {
      repeatNewPassword?.setErrors(null);
    }
    return null;
  }

  get email(): AbstractControl | null {
    return this.settingsForm.get('email');
  }
  get oldPassword(): AbstractControl | null {
    return this.settingsForm.get('oldPassword');
  }
  get newPassword(): AbstractControl | null {
    return this.settingsForm.get('newPassword');
  }
  get repeatNewPassword(): AbstractControl | null {
    return this.settingsForm.get('repeatNewPassword');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.formSubmitted = true; // Set flag to true when form is submitted

    // Stop if form is invalid
    if (this.settingsForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Build payload for the changePassword request
    const payload: ChangePasswordSettings = {
      oldPassword: this.oldPassword?.value,
      newPassword: this.newPassword?.value,
      email: this.email?.value,
    };

    // Call your AuthService
    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.isSubmitting = false;
        this.showLogoutPopup = true;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.errors[0].message || 'Failed to change password.';
        this.isSubmitting = false;
      },
    });
  }

  // Reset the form and form submission state
  resetForm(): void {
    this.formSubmitted = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.settingsForm.get('oldPassword')?.setValue('');
    this.settingsForm.get('newPassword')?.setValue('');
    this.settingsForm.get('repeatNewPassword')?.setValue('');
  }

  showLogoutPopup = false; // Flag for displaying logout popup

  onLogout(): void {
    this.authService.logout();
  }

  // Close the popup (optional, if you want to allow dismissing the modal)
  closePopup(): void {
    this.showLogoutPopup = false;
  }
}
