import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileServiceService {
  constructor(private apiService: ApiService) {}

  editIdentification(id: string, profile: Profile): Observable<Profile> {
    return this.apiService.patch<Profile>(`/profile/${id}`, profile);
  }

  getAllAraFocus(page: number, limit: number): Observable<any> {
    return this.apiService.get<any[]>(
      `/areas-of-focus?page=${page}&limit=${limit}`
    );
  }
  getAllDomains(page: number, limit: number): Observable<any> {
    return this.apiService.get<any[]>(`/domains?page=${page}&limit=${limit}`);
  }
  getAllRegions(page: number, limit: number): Observable<any> {
    return this.apiService.get<any[]>(`/regions?page=${page}&limit=${limit}`);
  }
}
