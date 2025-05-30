import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consultant } from '../models/consultant';

export interface ChatData {
  consultantAgentId?: any;
  userQuestion?: string;
  selectedConsultant?: Consultant | any;
  imageUrl?: string;
  selectedFile?: File;
  conversationId?: string;
  firstMessage?: Array<{
    sender: string;
    text: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class PassDataForChatService {
  // BehaviorSubject to hold and share chat data across components
  private chatDataSubject = new BehaviorSubject<ChatData>({});

  // Observable that components can subscribe to
  public chatData$: Observable<ChatData> = this.chatDataSubject.asObservable();

  constructor() {}

  /**
   * Set chat data to be shared between components
   * @param data Chat data containing consultant agent ID and user question
   */
  // setChatData(data: ChatData): void {
  //   this.chatDataSubject.next(data);
  // }

  setChatData(data: any) {
    console.log('Setting chat data with conversationId:', data.conversationId);
    this.chatDataSubject.next(data);
  }

  /**
   * Get the current chat data
   * @returns Current chat data
   */
  getCurrentChatData(): ChatData {
    return this.chatDataSubject.getValue();
  }

  /**
   * Clear all chat data
   */
  clearChatData(): void {
    this.chatDataSubject.next({});
  }

  updateConversationId(conversationId: string) {
    const currentData = this.chatDataSubject.value;
    if (currentData) {
      this.chatDataSubject.next({
        ...currentData,
        conversationId: conversationId,
      });
    }
  }
}
