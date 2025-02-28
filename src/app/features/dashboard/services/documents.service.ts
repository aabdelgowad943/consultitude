import { Injectable } from '@angular/core';
import { GenericApiService } from '../../../shared/services/generic-api.service';
import { Observable } from 'rxjs';
import { DocumentsResponse } from '../models/documents';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  constructor(
    private apiService: GenericApiService,
    private httpClient: HttpClient
  ) {}

  getAllDocumentsByUserId(
    userId: string,
    page: number,
    limit: number,
    language: string
  ): Observable<any[]> {
    const headers = { 'accept-language': language };
    return this.httpClient.get<any[]>(
      `${environment.url}/profile/my-downloads/${userId}?page=${page}&limit=${limit}`,
      { headers }
    );
  }

  viewDocumentByUserIdAndByOrderId(
    userId: string,
    orderId: string,
    language: string
  ): Observable<any[]> {
    const headers = { 'accept-language': language };
    return this.httpClient.get<any[]>(
      `${environment.url}/profile/my-downloads/${userId}/${orderId}`,
      { headers }
    );
  }
}
