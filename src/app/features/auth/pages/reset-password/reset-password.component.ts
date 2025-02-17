import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  email: string = '';
  emailExists: boolean = false;
  showPopup: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  checkEmail() {
    // Simulate an API call to check if the email exists
    if (this.email === 'ahmed@mail.com') {
      this.emailExists = true;
      this.showPopup = true; // Show the popup
      this.errorMessage = ''; // Clear any previous error message
    } else {
      this.errorMessage = 'Email does not exist';
    }
  }

  closePopup() {
    this.showPopup = false;
    this.router.navigate(['/auth/verify-otp'], {
      queryParams: { email: this.email },
    });
  }
}
