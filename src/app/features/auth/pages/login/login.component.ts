import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NavbarComponent, FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailExists: boolean = false;
  showPasswordInput: boolean = false;
  passwordFieldType: string = 'password';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const loginData: Login = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.errorMessage = res.data.message;
        localStorage.setItem('token', res.data.token);
        const userId = this.authService.getTokenData();
        localStorage.setItem('userId', userId);
        this.router.navigate(['/index']);

        // console.log('user id is', userId);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        this.errorMessage = err.error.errors[0].message;
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

  loginWithLinkedIn() {
    window.location.href = 'http://13.51.183.148:3000/auth/linkedin';
  }
}
