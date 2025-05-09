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
import { ResponseDepthComponent } from './components/response-depth/response-depth.component';
import { EvoServicesService } from '../../services/evo-services.service';
import { finalize } from 'rxjs';
import { Chat, ChatTest } from '../../models/chat';
import { Consultant } from '../../models/consultant';
import {
  getResponseDepthValue,
  ResponseDepth,
} from '../../models/response-depth.enum';

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
    ResponseDepthComponent,
  ],
  templateUrl: './ask-evo.component.html',
  styleUrl: './ask-evo.component.scss',
  providers: [DialogService, DynamicDialogRef],
})
export class AskEvoComponent {
  responseDepthId: string = 'advanced'; // String representation for UI
  responseDepthValue: ResponseDepth = ResponseDepth.Advanced;

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

  suggestedAgentsData: any[] = []; // Add this property

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
      this.resetState();
    }
  }

  // Process the user's question
  processUserQuestion() {
    this.currentStep = 3; // Move to a results step that we'll implement later
  }

  // Create a map to track the selection state of all consultants
  consultantSelectionMap: Map<string, boolean> = new Map();

  // Modify onSelectedConsultantsChange
  onSelectedConsultantsChange(consultants: Consultant[]) {
    // Clear previous selections
    this.consultantSelectionMap.clear();

    // Store the selection state of each consultant
    consultants.forEach((consultant) => {
      // Use a unique identifier like agentId
      const key = consultant.agentId || consultant.id.toString();
      this.consultantSelectionMap.set(key, true);
    });

    // Update selectedConsultants
    this.selectedConsultants = consultants;
  }
  // store selected service id
  onSelectedServiceIdChange(serviceId: string) {
    this.serviceId = serviceId;
  }

  // Handle selected response depth
  onResponseDepthChange(depthId: string) {
    this.responseDepthId = depthId;
    this.responseDepthValue = getResponseDepthValue(depthId);
  }

  onResponseDepthValueChange(depthValue: ResponseDepth) {
    this.responseDepthValue = depthValue;
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
        // responseDepth: this.responseDepthValue, // Use the enum value instead of string
      })
      .pipe(
        // Add RxJS operators to handle the flow
        finalize(() => {
          // This will run whether the observable completes successfully or errors out
          this.isAnalyzing = false;
          this.analysisComplete = true;

          // Move to next step after analysis
          this.currentStep = 4;
        })
      )
      .subscribe({
        next: (res) => {
          // console.log('API response:', JSON.stringify(res, null, 2));

          if (res?.data?.suggested_agents) {
            // Store the original data
            this.suggestedAgentsData = res.data.suggested_agents.map(
              (agent: any) => {
                // Create a properly structured agent object with all required fields
                const mappedAgent = {
                  name: agent.name || 'Consultant',
                  persona: agent.persona || '',
                  profileId: agent.profileId || '',
                  agentId: agent.agentId || '',
                  // Include other properties if needed
                  domains: agent.domains || [],
                  sectors: agent.sectors || [],
                  location: agent.location || '',
                  output: agent.output || '',
                  selected: true, // Set all agents to selected by default
                };

                // console.log(
                //   'Mapped agent:',
                //   JSON.stringify(mappedAgent, null, 2)
                // );
                return mappedAgent;
              }
            );

            // console.log(
            //   'Mapped suggested agents:',
            //   JSON.stringify(this.suggestedAgentsData, null, 2)
            // );

            // Set the selected consultants (all suggested agents are selected by default)
            this.selectedConsultants = [...this.suggestedAgentsData];
          } else {
            console.error('Invalid API response structure:', res);
            this.suggestedAgentsData = [];
            this.selectedConsultants = [];
          }
        },
        error: (err) => {
          console.error('Document analysis error:', err);
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
      this.currentStep = 3; // Go to response depth selection
    } else if (this.currentStep === 3) {
      this.analyzeDocument(); // Now analyze document after depth selection
    } else if (this.currentStep === 4) {
      this.currentStep = 5; // Move to the summary step
    } else if (this.currentStep === 5) {
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
    this.suggestedAgentsData = []; // Add this line
    this.responseDepthId = 'advanced'; // Reset to default
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
    // Add response depth to chat data
    const enhancedChatData = {
      ...chatData,
      // responseDepth: this.responseDepthValue, // Use the enum value
    };

    this.evoService.startChat(enhancedChatData).subscribe({
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
