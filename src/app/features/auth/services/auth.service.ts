import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Login } from '../models/login';
import { Register, ResetPassword, VerifyEmail } from '../models/register';
import { Observable } from 'rxjs';

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

  isEmailExist(email: string) {
    return this.apiService.post('/auth/is-email-exists', {
      email: email,
    });
  }
}
