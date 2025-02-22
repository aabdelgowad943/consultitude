import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from '../../../../shared/services/api.service';
import { Product, ProductStatus } from '../models/products';
import { Language } from '../models/language.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  constructor(private apiService: ApiService) {}

  getAllProducts(
    page: number = 1,
    limit: number = 10,
    statuses: ProductStatus[] = [ProductStatus.ACTIVE, ProductStatus.ARCHIVED],
    language: Language = Language.EN,
    search: string = '',
    sortBy: string = '',
    areaOfFocus: string[] = [],
    domains: string[] = [],
    documentTypes: string[] = [],
    features: string[] = [],
    minPrice: number = 0,
    maxPrice: number = 1000
  ): Observable<{ products: Product[]; totalPages: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    // .set('language', language); // Add language as a query parameter

    if (statuses?.length) {
      // params = params.set('statuses', statuses.join(','));
    }
    if (search) {
      params = params.set('search', search);
    }
    if (sortBy) {
      // params = params.set('sortBy', sortBy);
    }
    if (areaOfFocus.length) {
      params = params.set('areaOfFocusIds', areaOfFocus.join(','));
    }
    if (domains.length) {
      params = params.set('domainIds', domains.join(','));
    }
    if (documentTypes.length) {
      params = params.set('documentFormatIds', documentTypes.join(','));
    }
    if (features.length) {
      params = params.set('featureIds', documentTypes.join(','));
    }
    // params = params.set('minPrice', minPrice.toString());
    // params = params.set('maxPrice', maxPrice.toString());

    const headers = new HttpHeaders().set('Accept-Language', 'EN'); // Set Accept-Language header

    return this.apiService
      .get<{ data: Product[]; meta: { totalPages: number } }>('/products', {
        params,
        headers,
      })
      .pipe(
        map((response) => ({
          products: response?.data ?? [],
          totalPages: response?.meta?.totalPages || 1,
        }))
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>('/products/' + id);
  }

  getAllDomains(page: number = 1, limit: number = 100): Observable<any[]> {
    return this.apiService
      .get<any>(`/domains?page=${page}&limit=${limit}`)
      .pipe(
        map((response) =>
          response.data.map((item: any) => ({
            id: item.domainId || item.id || null,
            name:
              item.translations && item.translations.length
                ? item.translations[0].name
                : '',
            checked: false,
          }))
        )
      );
  }

  getAllAreaFocus(page: number = 1, limit: number = 100): Observable<any[]> {
    return this.apiService
      .get<any>(`/areas-of-focus?page=${page}&limit=${limit}`)
      .pipe(
        map((response) =>
          response.data.map((item: any) => ({
            id: item.areaOfFocusId || item.id || null,
            name:
              item.translations && item.translations.length
                ? item.translations[0].name
                : '',
            checked: false,
          }))
        )
      );
  }

  getAllDocumentTypes(
    page: number = 1,
    limit: number = 100
  ): Observable<any[]> {
    return this.apiService
      .get<any>(`/document-formats?page=${page}&limit=${limit}`)
      .pipe(
        map((response) =>
          response.data.map((item: any) => ({
            id: item.documentFormatId || item.id || null,
            name: item.name,
            checked: false,
          }))
        )
      );
  }

  getAllFeatures(page: number = 1, limit: number = 100) {
    // return this.apiService
    //   .get<any>(`/features?page=${page}&limit=${limit}`)
    //   .pipe(
    //     map((response) =>
    //       response.data.map((item: any) => ({
    //         id: item.featureId || item.id || null,
    //         name:
    //           item.translations && item.translations.length
    //             ? item.translations[0].name
    //             : '',
    //         checked: false,
    //       }))
    //     )
    //   );
  }
}
