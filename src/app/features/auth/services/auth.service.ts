import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Login } from '../models/login';
import { Register } from '../models/register';
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
}
