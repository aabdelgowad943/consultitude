import { Injectable } from '@angular/core';
import { GenericApiService } from '../../../shared/services/generic-api.service';
import { Subscribe } from '../models/subscribe';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscribeService {
  constructor(private genericApiService: GenericApiService) {}

  subscribe(subscribe: Subscribe): Observable<Subscribe> {
    return this.genericApiService.post('', subscribe.email);
  }
}
