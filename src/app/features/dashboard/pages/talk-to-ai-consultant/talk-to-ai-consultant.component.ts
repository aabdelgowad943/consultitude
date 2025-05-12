import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { EvoServicesService } from '../../services/evo-services.service';
import { ChatWithConsultantComponent } from '../ask-evo/components/chat-with-consultant/chat-with-consultant.component';
import { ChatToConStartedComponent } from '../ask-evo/components/chat-to-con-started/chat-to-con-started.component';

@Component({
  selector: 'app-talk-to-ai-consultant',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDialogModule,
    FormsModule,
    ChatWithConsultantComponent,
    ChatToConStartedComponent,
  ],
  templateUrl: './talk-to-ai-consultant.component.html',
  styleUrl: './talk-to-ai-consultant.component.scss',
  providers: [DialogService, DynamicDialogRef],
})
export class TalkToAiConsultantComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  isLoading = false;

  errorMessage: string | null = null;
  showDocumentUploadStepper = false;
  showChatInterface = false;
  imageUrl: string = '';

  currentStep = 1;
  userQuestion: string = '';

  selectedFile: File | null = null;
  isUploading = false;
  isDragging = false;
  uploadProgress = 0;

  serviceId: string = '';

  // Messages for the chat interface
  messages: Array<{
    sender: 'user' | 'consultant';
    text: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }> = [];

  chatResponse: any = null;

  documentUrl: string = '';

  constructor(private evoService: EvoServicesService) {}

  onShowDocumentUploadStepper(show: boolean) {
    this.showDocumentUploadStepper = show;
    this.currentStep = 1;
    this.showChatInterface = false;
  }

  onFileUploadComplete(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.documentUrl = imageUrl; // Store the document URL when upload is complete
  }

  onFileUploadError(error: string) {
    this.errorMessage = error;
    this.selectedFile = null;
  }

  // Store selected service id
  onSelectedServiceIdChange(serviceId: string) {
    this.serviceId = serviceId;
  }

  continueToNextStep() {
    if (this.currentStep === 1) {
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
    } else if (this.currentStep === 3) {
      this.currentStep = 4; // Move to the summary step
    } else if (this.currentStep === 4) {
      // Show the chat interface
      this.showDocumentUploadStepper = false;
      this.showChatInterface = true;
    }
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  // Helper to reset state
  resetState() {
    this.currentStep = 1;
    this.selectedFile = null;
    this.userQuestion = '';
    this.errorMessage = null;
    this.showChatInterface = false;
    this.messages = [];
  }

  onQuestionChange(question: string) {
    this.userQuestion = question;
  }

  // Exit chat and return to initial view
  exitChat() {
    this.resetState();
    this.showChatInterface = false;
    this.currentStep = 1;
  }

  // Helper to get file size in readable format
  getReadableFileSize(): string {
    if (!this.selectedFile) return '';

    const bytes = this.selectedFile.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
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

    // Show chat interface
    this.showChatInterface = true;

    // Simulate consultant response after a short delay
    setTimeout(() => {
      this.simulateConsultantResponse(messageData.text);
    }, 1000);
  }

  // Simulate consultant response
  simulateConsultantResponse(userMessage: string) {
    // Simple response logic based on user message
    let response = '';

    if (
      userMessage.toLowerCase().includes('create') &&
      userMessage.toLowerCase().includes('document')
    ) {
      response =
        "Absolutely! I'm here to guide you through creating a structured, strategic proposal. Let's start with the basics:\n\n1. Document Goal: What is the main purpose of this document? (e.g., benchmarking, project proposal, marketing plan)\n2. Audience: Who will be reading or reviewing it? (e.g., executive team, potential investors, internal teams)";
    } else if (
      userMessage.toLowerCase().includes('idea') ||
      userMessage.toLowerCase().includes('inspire')
    ) {
      response =
        "I'd be happy to inspire you with some creative ideas! To provide the most relevant suggestions, could you tell me a bit more about your business area or the specific challenge you're looking to address?";
    } else if (
      userMessage.toLowerCase().includes('strategy') ||
      userMessage.toLowerCase().includes('develop')
    ) {
      response =
        "Developing a strong strategy is crucial for success. To help you create an effective strategic plan, I'll need to understand:\n\n1. What are your key business objectives for this initiative?\n2. Who is your target audience?\n3. What resources do you have available?\n\nCould you provide some details?";
    } else if (
      userMessage.toLowerCase().includes('initiative') ||
      userMessage.toLowerCase().includes('shape')
    ) {
      response =
        "I'd love to help you shape your initiative. To get started, could you share:\n\n1. What is the primary goal of this initiative?\n2. Who are the key stakeholders involved?\n3. What timeline are you working with?\n\nThis information will help me provide tailored guidance.";
    } else {
      response =
        "Thank you for your message. To help you more effectively, could you provide some additional context about your business goals or specific challenges you're facing? provide some additional context about your business goals or specific challenges you're facing?provide some additional context about your business goals or specific challenges you're facing?provide some additional context about your business goals or specific challenges you're facing?provide some additional context about your business goals or specific challenges you're facing?provide some additional context about your business goals or specific challenges you're facing?";
    }

    // Add consultant response to chat
    this.messages.push({
      sender: 'consultant',
      text: response,
      timestamp: new Date(),
    });
  }

  onStartChat(chatData: any) {
    this.evoService.startChat(chatData).subscribe({
      next: (response: any) => {
        this.chatResponse = response;
        this.showDocumentUploadStepper = false;
        this.showChatInterface = true;
      },
      complete: () => {
        // console.log('Chat stream completed');
        this.showDocumentUploadStepper = false;
      },
      error: (error) => {
        console.error('Error starting chat:', error);
        this.errorMessage = 'Failed to start chat';
      },
    });
  }
}
