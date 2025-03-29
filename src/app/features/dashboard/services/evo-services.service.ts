import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Observable } from 'rxjs';
import { Chat } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class EvoServicesService {
  constructor(private apiService: ApiService) {}

  getAllServices(page: number, limit: number): Observable<any[]> {
    return this.apiService.get(`/services?page=${page}&limit=${limit}`);
  }

  suggestAgents(suggest: any): Observable<any> {
    return this.apiService.post('/chats/suggest-agents', suggest);
  }

  // startChat(chat: Chat): Observable<Chat> {
  //   return this.apiService.post('/chats', chat);
  // }
  startChat(chat: Chat): Observable<Chat> {
    return this.apiService.post('/chats/stream', chat);
  }
}
