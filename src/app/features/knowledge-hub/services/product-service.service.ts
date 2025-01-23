import { Injectable } from '@angular/core';
import productsData from '../../../../../public/data/product.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private dataUrl = '/data/product.json';

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }
}
