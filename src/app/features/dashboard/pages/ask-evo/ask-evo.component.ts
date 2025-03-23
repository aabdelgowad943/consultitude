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

  // Store selected consultants
  selectedConsultants: Consultant[] = [];

  agents: Agent[] = [
    {
      id: 1,
      type: 'Customer Support Assistant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      manager: {
        initial: 'images/new/circle.svg',
        name: 'Consultitude',
      },
      commentCount: 1,
    },
  ];

  conversations: any = [
    {
      title: 'Potato Expert Brand Onboarding Script',
      date: '11 Apr, 12:42 pm',
    },
  ];

  onShowDocumentUploadStepper(show: boolean) {
    this.showDocumentUploadStepper = show;
    this.currentStep = 1;
    this.showChatInterface = false;
  }

  onFileUploadComplete(imageUrl: string) {
    this.imageUrl = imageUrl;
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

  // Handle Enter key press in the question input
  onQuestionInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.userQuestion.trim() && !event.shiftKey) {
      event.preventDefault();
      this.continueToNextStep();
    }
  }

  analyzeDocument() {
    this.isAnalyzing = true;
    this.analysisComplete = false;
    // Simulate document analysis
    setTimeout(() => {
      // After some time, switch the text styling (as shown in your images)
      this.analysisComplete = true;
      // After analysis is complete, wait a moment and then show consultants
      setTimeout(() => {
        this.isAnalyzing = false;
        this.currentStep = 3; // Move to step 3 (consultant suggestions)
      }, 1500);
    }, 3000);
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
}
