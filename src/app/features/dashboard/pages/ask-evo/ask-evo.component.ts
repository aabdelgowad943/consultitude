import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { AskEvoLoaderComponent } from '../../../../shared/loaders/ask-evo-loader/ask-evo-loader.component';
import { StepperLoaderComponent } from '../../../../shared/loaders/stepper-loader/stepper-loader.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { QuestionInputComponent } from './components/question-input/question-input.component';
import { AnalyzingDocumentComponent } from './components/analyzing-document/analyzing-document.component';
import { ConsultingSuggestionComponent } from './components/consulting-suggestion/consulting-suggestion.component';
import { AskEvoHeaderComponent } from './components/ask-evo-header/ask-evo-header.component';
import { ChatComponent } from './components/chat/chat.component';
import { SummaryDetailsComponent } from './components/summary-details/summary-details.component';
import { Consultant } from './components/consulting-suggestion/consulting-suggestion.component';
import { EvoServicesService } from '../../services/evo-services.service';
import { finalize } from 'rxjs';
import { Chat, ChatTest } from '../../models/chat';

export interface Agent {
  id: number;
  type: string;
  description: string;
  manager: {
    initial: string;
    name: string;
  };
  commentCount: number;
}

@Component({
  selector: 'app-ask-evo',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDialogModule,
    FormsModule,
    AskEvoLoaderComponent,
    StepperLoaderComponent,
    FileUploadComponent,
    QuestionInputComponent,
    AnalyzingDocumentComponent,
    ConsultingSuggestionComponent,
    AskEvoHeaderComponent,
    ChatComponent,
    SummaryDetailsComponent,
  ],
  templateUrl: './ask-evo.component.html',
  styleUrl: './ask-evo.component.scss',
  providers: [DialogService, DynamicDialogRef],
})
export class AskEvoComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  title = 'evo-dashboard';
  isLoading = false;

  isAnalyzing = false;
  analysisComplete = false;

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

  // Store selected consultants
  selectedConsultants: Consultant[] = [];

  agents: Agent[] = [];

  conversations: any = [
    {
      title: 'Potato Expert Brand Onboarding Script',
      date: '11 Apr, 12:42 pm',
    },
  ];

  chatResponse: any = null;

  constructor(private evoService: EvoServicesService) {}

  onShowDocumentUploadStepper(show: boolean) {
    this.showDocumentUploadStepper = show;
    this.currentStep = 1;
    this.showChatInterface = false;
  }

  documentUrl: string = '';

  onFileUploadComplete(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.documentUrl = imageUrl; // Store the document URL when upload is complete
  }

  onFileUploadError(error: string) {
    this.errorMessage = error;
    this.selectedFile = null;
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.showDocumentUploadStepper = false;
      this.resetState(); // Only reset when completely exiting the stepper
    }
  }

  // Process the user's question
  processUserQuestion() {
    this.currentStep = 3; // Move to a results step that we'll implement later
  }

  // Store selected consultants
  onSelectedConsultantsChange(consultants: Consultant[]) {
    this.selectedConsultants = consultants;
  }

  // store selected service id
  onSelectedServiceIdChange(serviceId: string) {
    this.serviceId = serviceId;
  }

  // Handle Enter key press in the question input
  onQuestionInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.userQuestion.trim() && !event.shiftKey) {
      event.preventDefault();
      this.continueToNextStep();
    }
  }

  analyzeDocument() {
    // Reset analysis state
    this.isAnalyzing = true;
    this.analysisComplete = false;
    this.errorMessage = '';

    this.evoService
      .suggestAgents({
        ask: this.userQuestion,
        documents: [this.documentUrl],
      })
      .pipe(
        // Add RxJS operators to handle the flow
        finalize(() => {
          // This will run whether the observable completes successfully or errors out
          this.isAnalyzing = false;
          this.analysisComplete = true;

          // Move to next step after analysis
          this.currentStep = 3;
        })
      )
      .subscribe({
        next: (res) => {
          // console.log('Analysis result:', res);
          this.selectedConsultants = res.data.suggested_agents;
        },
        error: (err) => {
          // console.error('Document analysis error:', err);
          this.errorMessage = 'An error occurred while analyzing the document';
          // Optionally reset analysis state more explicitly on error
          this.isAnalyzing = false;
          this.analysisComplete = false;
        },
      });
  }

  continueToNextStep() {
    if (this.currentStep === 1) {
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.analyzeDocument();
    } else if (this.currentStep === 3) {
      this.currentStep = 4; // Move to the new summary step
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
    this.userQuestion = ''; // Only reset question when completely exiting
    this.isAnalyzing = false;
    this.analysisComplete = false;
    this.errorMessage = null; // Also reset error message
    this.showChatInterface = false;
    this.selectedConsultants = []; // Reset selected consultants
  }

  onQuestionChange(question: string) {
    this.userQuestion = question;
  }

  // New method to exit chat and return to initial view
  exitChat() {
    this.showChatInterface = false;
    this.resetState();
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

  // =================================================
  onStartChat(chatData: any) {
    this.evoService.startChat(chatData).subscribe({
      next: (response: any) => {
        this.chatResponse = response;

        // Then switch the view
        this.showDocumentUploadStepper = false;
        this.showChatInterface = true;
      },
      complete: () => {
        console.log('Chat stream completed');
        // Optionally handle completion logic here
        this.showDocumentUploadStepper = false;
      },
      error: (error) => {
        console.error('Error starting chat:', error);
        this.errorMessage = 'Failed to start chat';
      },
    });
  }
}
