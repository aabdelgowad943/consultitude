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
  fileUrl: string = '';
  documentUrl: string = '';

  selectedFileFromHome: File | null = null;

  // New properties to store data from the service
  consultantAgentId: string = '';
  userQuestion: string = '';
  selectedConsultant: Consultant | null = null;

  constructor(private passDataForChatService: PassDataForChatService) {}

  ngOnInit() {
    // Get data from the service
    const chatData = this.passDataForChatService.getCurrentChatData();

    if (chatData) {
      this.consultantAgentId = chatData.consultantAgentId || '';
      this.userQuestion = chatData.userQuestion || '';
      this.selectedConsultant = chatData.selectedConsultant || null;
      this.fileUrl = chatData.imageUrl || '';
      this.selectedFileFromHome = chatData.selectedFile!;

      console.log('----------------data passsssssed--------------------');
      console.log(this.consultantAgentId);
      console.log(this.userQuestion);
      console.log(this.selectedConsultant);
      console.log(this.fileUrl);
      console.log('2', this.selectedFileFromHome);
      console.log('----------------data passsssssed--------------------');

      // If there's user input from the service, process it immediately
      if (this.userQuestion) {
        this.processInitialUserQuestion();
      }
    }
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

      // Simulate consultant response after a short delay
      setTimeout(() => {
        this.simulateConsultantResponse(this.userQuestion);
      }, 1000);
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
        "Thank you for your message. To help you more effectively, could you provide some additional context about your business goals or specific challenges you're facing?";
    }

    // Add consultant response to chat
    this.messages.push({
      sender: 'consultant',
      text: response,
      timestamp: new Date(),
    });
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
  }

  onFileUploadComplete(imageUrl: string) {
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
    this.passDataForChatService.clearChatData();
  }
  currentStep = 1;
}
