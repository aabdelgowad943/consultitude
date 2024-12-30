import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericApiService {
  private readonly apiUrl = environment.url;

  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http.get<T>(this.apiUrl + url, options);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.apiUrl + endpoint, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.apiUrl + endpoint, body);
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(this.apiUrl + endpoint, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.apiUrl + endpoint);
  }
}
