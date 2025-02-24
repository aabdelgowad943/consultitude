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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

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

  getTokenData(): string {
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
}
