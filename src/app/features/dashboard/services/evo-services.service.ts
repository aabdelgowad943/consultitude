import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { filter, from, map, mergeMap, Observable } from 'rxjs';
import { Chat } from '../models/chat';
import { HttpClient, HttpDownloadProgressEvent, HttpEventType, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EvoServicesService {
  constructor(private apiService: ApiService, private http: HttpClient) { }

  getAllServices(page: number, limit: number): Observable<any[]> {
    return this.apiService.get(`/services?page=${page}&limit=${limit}`);
  }

  suggestAgents(suggest: any): Observable<any> {
    return this.apiService.post('/chats/suggest-agents', suggest);
  }

  startChat(chat: Chat): Observable<Chat> {
    return this.apiService.post('/chats', chat);
  }


  // processData(data: any): Observable<any> {
  //   return this.http.post(environment.url + '/chats/stream', data, {
  //     responseType: 'text',
  //     reportProgress: true,
  //     observe: 'events'
  //   }).pipe(
  //     filter((event): event is HttpDownloadProgressEvent => event.type === HttpEventType.DownloadProgress),
  //     map((event: HttpDownloadProgressEvent) => {
  //       // Extract the partial response text from the event
  //       const partialText = event.partialText || '';

  //       // Parse the SSE data format
  //       if (partialText && partialText.includes('data:')) {
  //         const messages = partialText.split('\n\n')
  //           .filter(chunk => chunk.trim().startsWith('data:'))
  //           .map(chunk => {
  //             const dataStr = chunk.replace(/^data:\s*/, '');
  //             try {
  //               console.log('Parsed data:', dataStr); // Log the parsed data

  //               return JSON.parse(dataStr);
  //             } catch (e) {
  //               return null;
  //             }
  //           })
  //           .filter(data => data !== null);

  //         return messages.length > 0 ? messages[messages.length - 1] : null;
  //       }
  //       return null;
  //     }),
  //     filter(data => data !== null)
  //   );
  // }


  processData(data: any): Observable<any> {
    let buffer = ''; // Create a buffer to accumulate partial data

    return this.http.post(environment.url + '/chats/stream', data, {
      responseType: 'text',
      reportProgress: true,
      observe: 'events'
    }).pipe(
      filter((event): event is HttpDownloadProgressEvent =>
        event.type === HttpEventType.DownloadProgress
      ),
      map((event: HttpDownloadProgressEvent) => {
        // Get the partial text from this event
        const partialText = event.partialText || '';

        // Add it to our running buffer
        buffer += partialText;

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
              messages.push(JSON.parse(chunk));
            } catch (e) {
              console.warn('Failed to parse JSON:', dataStr, e);
            }
          }
        }

        return messages.length > 0 ? messages : null;
      }),
      filter(data => data !== null),
      // Flatten the array of messages
      mergeMap(messages => from(messages))
    );
  }
}
