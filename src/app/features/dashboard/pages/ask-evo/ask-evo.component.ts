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

interface Agent {
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
  imports: [CommonModule, DynamicDialogModule],
  templateUrl: './ask-evo.component.html',
  styleUrl: './ask-evo.component.scss',
  providers: [DialogService, DynamicDialogRef],
})
export class AskEvoComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  title = 'evo-dashboard';
  isLoading = false;

  errorMessage: string | null = null;
  showDocumentUploadStepper = false;
  imageUrl: string = '';

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
    {
      id: 3,
      type: 'Sales Executive',
      description:
        'Focused on driving revenue growth through new client acquisition and relationship management',
      manager: {
        initial: 'J',
        name: 'Jordan T.',
      },
      commentCount: 1,
    },
    {
      id: 4,
      type: 'Marketing Specialist',
      description:
        'Expert in digital marketing strategies and brand development to enhance market presence',
      manager: {
        initial: 'A',
        name: 'Alex R.',
      },
      commentCount: 1,
    },
    {
      id: 5,
      type: 'Product Manager',
      description:
        'Oversees product development from conception to launch, aligning business goals with user needs',
      manager: {
        initial: 'T',
        name: 'Taylor M.',
      },
      commentCount: 1,
    },
    {
      id: 6,
      type: 'UX Designer',
      description:
        'Creates user-centered designs that enhance usability and improve overall user satisfaction',
      manager: {
        initial: 'S',
        name: 'Casey L.',
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
      // allow image
      'image/jpeg',
      'image/png',
      'image/gif',

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

  // Handle the continue button click
  continueToNextStep() {
    if (this.selectedFile) {
      // Implement your logic to go to the next step
      console.log('Continuing to next step with file:', this.selectedFile.name);
      // You can add navigation or state change logic here
    }
  }
}
