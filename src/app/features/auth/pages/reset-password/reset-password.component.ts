import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  showPopup: boolean = false;
  isSubmitting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  handleSubmit() {
    this.errorMessage = '';

    // Client-side validation
    if (!this.email) {
      this.errorMessage = 'Email is required';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isSubmitting = true;

    this.authService.isEmailExist(this.email).subscribe({
      next: (res: any) => {
        this.sendResetEmail();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Email does not exist in our system';
      },
    });
  }

  private sendResetEmail() {
    this.authService.resetPassword({ email: this.email }).subscribe({
      next: () => {
        this.showPopup = true;
        this.isSubmitting = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        // console.log('e', err.error);
        // console.log('ee', err.error.errors);
        // console.log('eee', );

        this.errorMessage = err.error.errors[0].message;
      },
    });
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  closePopup() {
    this.showPopup = false;
    this.router.navigate(['/auth/login']);
    // , {
    //   queryParams: { otp: 123, email: this.email },
    // });
  }
}
