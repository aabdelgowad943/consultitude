import {
  Component,
  ElementRef,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { ProfileServiceService } from '../../../../services/profile-service.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  constructor(private profileService: ProfileServiceService) {}

  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileSelected = new EventEmitter<File>();
  // @Output() removeFile = new EventEmitter<void>();

  isDragging = false;
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;

  errorMessage: string | null = null;
  showDocumentUploadStepper = false;
  imageUrl: string = '';

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
}
