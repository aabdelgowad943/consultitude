import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { filter, map, Observable } from 'rxjs';
import { Profile } from '../models/profile';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileServiceService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

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

  getAllSkills(): Observable<any[]> {
    return this.apiService.get<any[]>(`/top-skill`);
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.apiService.post<any>('/uploads/upload', formData);
  }

  // In profile-service.service.ts
  uploadFileWithProgress(formData: FormData) {
    // Add an observable to track upload progress
    return this.http
      .post<any>(environment.url + '/upload', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            // Calculate progress percentage
            return { progress: Math.round((100 * event.loaded) / event.total) };
          } else if (event.type === HttpEventType.Response) {
            // Return the response
            return event.body;
          }
          return null;
        }),
        filter((event) => event !== null)
      );
  }
}
