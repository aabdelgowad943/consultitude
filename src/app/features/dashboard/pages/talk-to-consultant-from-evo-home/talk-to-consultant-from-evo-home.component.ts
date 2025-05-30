import { Component, OnInit } from '@angular/core';
import { ChatToConStartedComponent } from '../ask-evo/components/chat-to-con-started/chat-to-con-started.component';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PassDataForChatService } from '../../services/pass-data-for-chat.service';
import { Consultant } from '../../models/consultant';

@Component({
  selector: 'app-talk-to-consultant-from-evo-home',
  imports: [ChatToConStartedComponent, CommonModule],
  templateUrl: './talk-to-consultant-from-evo-home.component.html',
  styleUrl: './talk-to-consultant-from-evo-home.component.scss',
  providers: [DialogService, DynamicDialogRef],
})
export class TalkToConsultantFromEvoHomeComponent implements OnInit {
  showChatInterface = false;
  // Messages for the chat interface
  messages: Array<{
    sender: 'user' | 'consultant';
    text: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }> = [];

  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  errorMessage: string | null = null;
  fileUrl: any;
  documentUrl: string = '';
  selectedFileFromHome: File | null = null;

  // New properties to store data from the service
  consultantAgentId: string = '';
  userQuestion: string = '';
  selectedConsultant: Consultant | null = null;

  conversationId: string = '';

  constructor(private passDataForChatService: PassDataForChatService) {}

  ngOnInit() {
    // Subscribe to chat data updates
    this.passDataForChatService.chatData$.subscribe((chatData) => {
      console.log('Updated chat data:', chatData);

      if (chatData) {
        this.consultantAgentId = chatData.consultantAgentId || '';
        this.userQuestion = chatData.userQuestion || '';
        this.selectedConsultant = chatData.selectedConsultant || null;
        this.fileUrl = chatData.imageUrl || '';
        this.selectedFileFromHome = chatData.selectedFile!;
        this.conversationId = chatData.conversationId || '';

        // Process initial question only if we have both question and conversationId
        if (this.userQuestion && this.conversationId) {
          this.processInitialUserQuestion();
        }
      }
    });
  }

  receivedMessages: any;

  receiveDataFromChild(data: any) {
    this.receivedMessages = data;
    console.log('Received from child:', data);

    // Add the actual consultant response to the messages array
    this.messages.push({
      sender: 'consultant',
      text: data.text,
      timestamp: new Date(data.timestamp),
    });
  }

  // Process the initial user question that came from the service
  processInitialUserQuestion() {
    if (this.userQuestion) {
      // Add user message to chat
      this.messages.push({
        sender: 'user',
        text: this.userQuestion,
        timestamp: new Date(),
      });

      // Show chat interface
      this.showChatInterface = true;
    }
  }

  // Handler for message sent from initial chat component
  onMessageSent(messageData: {
    text: string;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }) {
    // Add user message to chat
    this.messages.push({
      sender: 'user',
      text: messageData.text,
      timestamp: new Date(),
      attachments: messageData.attachments,
    });
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onFileUploadComplete(imageUrl: any) {
    this.fileUrl = imageUrl;
    this.documentUrl = imageUrl; // Store the document URL when upload is complete
  }

  onFileUploadError(error: string) {
    this.errorMessage = error;
    this.selectedFile = null;
  }

  // Exit chat and return to initial view
  exitChat() {
    this.resetState();
    this.showChatInterface = false;
    this.currentStep = 1;
  }

  // Helper to reset state
  resetState() {
    this.currentStep = 1;
    this.selectedFile = null;
    this.userQuestion = '';
    this.errorMessage = null;
    this.showChatInterface = false;
    this.messages = [];

    // Clear the service data
    // this.passDataForChatService.clearChatData();
  }
  currentStep = 1;
}
