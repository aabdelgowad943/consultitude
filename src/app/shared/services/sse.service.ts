import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SSE } from 'sse.js';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private eventSource!: SSE;
  private messages = new BehaviorSubject<string>('');

  messages$ = this.messages.asObservable();

  connect() {
    this.eventSource = new SSE('http://localhost:3000/events/stream');

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messages.next(data.message);
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
