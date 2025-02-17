import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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

  constructor(private authService: AuthService) {}

  checkEmail() {
    // Simulate an API call to check if the email exists
    if (this.email === 'ahmed@mail.com') {
      this.emailExists = true;
      this.showPasswordInput = true;
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
}
