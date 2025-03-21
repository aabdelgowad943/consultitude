import { Component, ElementRef, ViewChild } from '@angular/core';
import { RapidResponseDialogComponent } from '../../components/rapid-response-dialog/rapid-response-dialog.component';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ProfileServiceService } from '../../services/profile-service.service';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AskEvoLoaderComponent } from '../../../../shared/loaders/ask-evo-loader/ask-evo-loader.component';
import { StepperLoaderComponent } from '../../../../shared/loaders/stepper-loader/stepper-loader.component';

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
  imports: [
    CommonModule,
    DynamicDialogModule,
    FormsModule,
    AskEvoLoaderComponent,
    StepperLoaderComponent,
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
  imageUrl: string = '';

  // Current step in the document upload process
  currentStep = 1;
  userQuestion: string = '';

  // File upload related properties
  selectedFile: File | null = null;
  isUploading = false;
  isDragging = false;
  uploadProgress = 0;

  agents: Agent[] = [
    {
      id: 1,
      type: 'Customer Support Assistant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      manager: {
        initial: 'S',
        name: 'Sayed E.',
      },
      commentCount: 1,
    },
    {
      id: 2,
      type: 'Customer Support Assistant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      manager: {
        initial: 'S',
        name: 'Sayed E.',
      },
      commentCount: 1,
    },
  ];

  constructor(
    private dialogService: DialogService,
    private profileService: ProfileServiceService
  ) {}

  openRapidResponseDialog() {
    const dialogRef = this.dialogService.open(RapidResponseDialogComponent, {
      header: '',
      width: '600px',
      contentStyle: {
        'border-radius': '20px',
        padding: '0px',
        'overflow-y': 'auto',
        'scrollbar-width': 'none', // Firefox
        '-ms-overflow-style': 'none', // IE and Edge
      },
      showHeader: false,
      // modal: true,
    });

    dialogRef.onClose.subscribe((result) => {
      if (result && result.showStepper) {
        this.showDocumentUploadStepper = true;
        this.currentStep = 1;
      }
    });
  }

  // File drag and drop handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
    }
  }

  // File input change handler
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processFile(file);
    }
  }

  // Process the selected file
  processFile(file: File) {
    // Check if file type is allowed (PDF, Word, etc.)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF, Word document, or text file.');
      return;
    }

    this.selectedFile = file;
    this.uploadFile(file);
  }

  uploadFile(file: File) {
    this.isUploading = true;
    this.errorMessage = null;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', file);

    this.profileService
      .uploadFile(formData)
      .pipe(
        finalize(() => {
          if (this.uploadProgress < 100) {
            this.isUploading = false;
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.progress) {
            this.uploadProgress = response.progress;
          } else {
            this.imageUrl = response.Location;

            this.uploadProgress = 100;
            setTimeout(() => {
              this.isUploading = false;
            }, 500);
          }
        },
        error: (error) => {
          this.errorMessage =
            error.error.message || 'Failed to upload file. Please try again.';
          this.selectedFile = null;
        },
      });
  }

  // Remove the uploaded file
  removeFile() {
    this.selectedFile = null;
    // Reset the file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Go back to previous step
  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.showDocumentUploadStepper = false;
    }
  }

  // Process the user's question
  processUserQuestion() {
    console.log('Processing question:', this.userQuestion);
    this.currentStep = 3; // Move to a results step that we'll implement later
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

  // Update the continueToNextStep method
  continueToNextStep() {
    if (this.currentStep === 1) {
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      // When continuing from step 2, start the document analysis process
      this.analyzeDocument();
    } else if (this.currentStep === 3) {
      // Handle completion
      this.showDocumentUploadStepper = false;
      // Reset for future use
      this.resetState();
    }
  }

  // Helper to reset state
  resetState() {
    this.currentStep = 1;
    this.selectedFile = null;
    this.userQuestion = '';
    this.isAnalyzing = false;
    this.analysisComplete = false;
  }
}
