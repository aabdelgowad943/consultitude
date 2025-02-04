import { Injectable } from '@angular/core';
import productsData from '../../../../../public/data/product.json';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../../shared/services/api.service';
import {
  ApiResponse,
  LanguageCode,
  Product,
  ProductStatus,
} from '../models/products';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private dataUrl = '/data/product.json';

  constructor(private http: HttpClient, private apiService: ApiService) {}

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  // product.service.ts
  getAllProducts(
    page: number = 1,
    limit: number = 10,
    statuses: ProductStatus[] = [ProductStatus.ACTIVE, ProductStatus.ARCHIVED],
    language: string = 'EN' // Default language
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (statuses?.length) {
      params = params.set('statuses', statuses.join(','));
    }

    // Create headers with Accept-Language
    const headers = new HttpHeaders().set('Accept-Language', language);

    return this.apiService
      .get<ApiResponse>('/products', { params, headers })
      .pipe(map((response) => response.data));
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>('/products/' + id);
  }
}
