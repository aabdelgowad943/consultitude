import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { filter, from, map, mergeMap, Observable } from 'rxjs';
import { Chat } from '../models/chat';
import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEventType,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EvoServicesService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  getAllServices(page: number, limit: number): Observable<any[]> {
    return this.apiService.get(`/services?page=${page}&limit=${limit}`);
  }

  suggestAgents(suggest: any): Observable<any> {
    return this.apiService.post('/chats/suggest-agents', suggest);
  }

  startChat(data: any): Observable<any> {
    let previousTextLength = 0; // Track how much text we've processed
    let buffer = ''; // Buffer for incomplete messages
    return this.http
      .post(environment.url + '/chats/stream', data, {
        responseType: 'text',
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        filter(
          (event): event is HttpDownloadProgressEvent =>
            event.type === HttpEventType.DownloadProgress
        ),
        map((event: HttpDownloadProgressEvent) => {
          // Get the full text received so far
          const fullText = event.partialText || '';

          // Extract only the new part we haven't processed yet
          const newText = fullText.substring(previousTextLength);
          previousTextLength = fullText.length;

          // Add new text to our buffer
          buffer += newText;

          // Try to extract complete SSE messages
          const messages = [];
          const chunks = buffer.split('\n\n');

          // The last chunk might be incomplete, so we keep it in the buffer
          buffer = chunks.pop() || '';

          // Process complete chunks
          for (const chunk of chunks) {
            if (chunk.trim().startsWith('data:')) {
              const dataStr = chunk.replace(/^data:\s*/, '');
              try {
                messages.push(JSON.parse(dataStr));
              } catch (e) {
                console.warn('Failed to parse JSON:', dataStr, e);
              }
            }
          }

          return messages.length > 0 ? messages : null;
        }),
        filter((data) => data !== null),
        // Flatten the array of messages
        mergeMap((messages) => from(messages))
      );
  }

  getChatsByUserId(
    userId: string,
    page: number,
    limit: number
  ): Observable<Chat[]> {
    return this.apiService.get<Chat[]>(
      `/chats/user/${userId}?page=${page}&limit=${limit}`
    );
  }

  getChatById(chatId: string): Observable<Chat> {
    return this.apiService.get<Chat>(`/chats/conversation-history/${chatId}`);
  }

  makeConversation(conversation: any): Observable<any> {
    return this.apiService.post('/chats/direct_conversation', conversation);
  }
}
