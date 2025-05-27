import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consultant } from '../models/consultant';

export interface ChatData {
  consultantAgentId?: any;
  userQuestion?: string;
  selectedConsultant?: Consultant | any;
  imageUrl?: string;
  selectedFile?: File;
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
    // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);
    // localStorage.setItem('contName', data.selectedConsultant.name);
    // localStorage.setItem('contID', data.selectedConsultant.agentId);

    // if (data.imageUrl != '') {
    //   localStorage.setItem('fileUrl', data.imageUrl!);
    // }
    // if (data.selectedFile?.name != '') {
    //   localStorage.setItem('fileName', `${data.selectedFile?.name}`);
    // }
    // if (`${data.selectedFile?.size}` != '') {
    //   localStorage.setItem('fileSize', `${data.selectedFile?.size}`);
    // }
    // localStorage.setItem('fileSize', data.selectedFile!.size.toString());
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
