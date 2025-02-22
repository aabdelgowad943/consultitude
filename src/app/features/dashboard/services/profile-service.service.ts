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
    return this.apiService.put<Profile>(`/profile/${id}`, profile);
  }
}
