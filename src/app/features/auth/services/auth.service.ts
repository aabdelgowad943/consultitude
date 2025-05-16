import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Login } from '../models/login';
import {
  ChangePassword,
  Register,
  ResetPassword,
  VerifyEmail,
} from '../models/register';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
import { ChangePasswordSettings } from '../models/change-password';
import { Router } from '@angular/router';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
  [key: string]: any; // For any other claims in your token
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService, private router: Router) {}

  login(login: Login): Observable<Login> {
    return this.apiService.post('/auth/login', login);
  }

  register(register: Register): Observable<Register> {
    return this.apiService.post('/auth/register', register);
  }

  verifyEmail(verifyEmail: VerifyEmail): Observable<VerifyEmail> {
    return this.apiService.post('/auth/verify-email', verifyEmail);
  }

  resetPassword(resetPassword: ResetPassword): Observable<ResetPassword> {
    return this.apiService.post('/auth/rest-password', resetPassword);
  }

  confirmResetPassword(
    changePassword: ChangePassword
  ): Observable<ChangePassword> {
    return this.apiService.post('/auth/verify-update-password', changePassword);
  }

  isEmailExist(email: string) {
    return this.apiService.post('/auth/is-email-exists', {
      email: email,
    });
  }

  getTokenData(): any {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    const decoded = this.decodeToken(token);
    return decoded?.id || '';
  }

  decodeToken(token: string): any {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  getUserDataByUserId(userId: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept-Language', 'EN'); // Set Accept-Language header

    return this.apiService.get<any>(`/profile/${userId}`, {
      headers: headers,
    });
  }

  changePassword(
    changePassword: ChangePasswordSettings
  ): Observable<ChangePasswordSettings> {
    return this.apiService.post('/auth/change-password', changePassword);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // note for solve linked in issue
  // ---check if no token ==> leave it
  // ---check put it in interceptor

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true; // No token means not authenticated
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      // console.log(decoded.exp);
      // console.log(currentTime);
      // if (decoded.exp > currentTime) {
      //   console.log('decode');
      // } else {
      //   console.log('current time');
      // }

      // If the expiration time is less than current time, token is expired
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If there's an error decoding, consider token invalid
    }
  }

  // Method to check and logout if token expired
  checkTokenAndLogout(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileId');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('profileUrl');
    localStorage.removeItem('name');
    localStorage.removeItem('serviceId');
    this.router.navigate(['/auth/login']);
  }
}
