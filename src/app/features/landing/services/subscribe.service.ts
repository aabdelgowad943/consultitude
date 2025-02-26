import { Injectable } from '@angular/core';
import { GenericApiService } from '../../../shared/services/generic-api.service';
import { Observable } from 'rxjs';
import { RequestDocument } from '../models/request-document';

@Injectable({
  providedIn: 'root',
})
export class SubscribeService {
  constructor(private genericApiService: GenericApiService) {}

  subscribe(email: string): Observable<any> {
    return this.genericApiService.post<any>(`/wait-list`, { email: email });
  }

  requestDocument(
    requestDocument: RequestDocument
  ): Observable<RequestDocument> {
    return this.genericApiService.post<RequestDocument>(
      `/request-documents`,
      requestDocument
    );
  }
}
