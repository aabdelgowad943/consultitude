import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Observable } from 'rxjs';

export interface Contact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private apiService: ApiService) {}

  createContactUs(contact: Contact): Observable<Contact> {
    return this.apiService.post('/contact-us', contact);
  }
}
