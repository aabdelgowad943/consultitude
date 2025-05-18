import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consultant } from '../models/consultant';

export interface ChatData {
  consultantAgentId?: any;
  userQuestion?: string;
  selectedConsultant?: Consultant | any;
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
  setChatData(data: ChatData): void {
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
}
