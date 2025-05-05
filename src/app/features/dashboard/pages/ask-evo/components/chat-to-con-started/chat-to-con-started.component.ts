import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileServiceService } from '../../../../services/profile-service.service';
import { finalize } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chat-to-con-started',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-to-con-started.component.html',
  styleUrl: './chat-to-con-started.component.scss',
  animations: [
    trigger('errorAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class ChatToConStartedComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  @Input() messages: Array<{
    sender: 'user' | 'consultant';
    text: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }> = [];

  @Input() selectedFile: File | null = null;
  @Input() isUploading = false;
  @Input() uploadProgress = 0;
  @Input() errorMessage: string | null = null;

  userInput: string = '';

  @Output() sendMessage = new EventEmitter<{
    text: string;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() uploadComplete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();
  @Output() exitChat = new EventEmitter<void>();
  @Output() fileRemove = new EventEmitter<void>();

  private errorTimeout: any; // To store the timeout reference

  constructor(private profileService: ProfileServiceService) {}

  onSendMessage() {
    if (!this.userInput.trim() && !this.selectedFile) return;

    let attachments:
      | Array<{ name: string; url: string; size: number }>
      | undefined;

    if (this.selectedFile) {
      attachments = [
        {
          name: this.selectedFile.name,
          url: '',
          size: this.selectedFile.size,
        },
      ];
    }

    this.sendMessage.emit({
      text: this.userInput,
      attachments,
    });

    this.userInput = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.uploadError.emit(
        'Please select a PDF, Word document, or text file.'
      );
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file); // Emit the file to parent
    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    this.isUploading = true;
    this.errorMessage = null;
    this.uploadProgress = 0;

    // Clear any existing timeout to prevent multiple timeouts
    // Clear any existing timeout to prevent multiple timeouts
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

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
            this.uploadProgress = 100;
            setTimeout(() => {
              this.isUploading = false;
              this.uploadComplete.emit(response.Location);
            }, 500);
          }
        },
        error: (error) => {
          const errorMessage =
            error.error.message || 'Failed to upload file. Please try again.';
          this.showError(errorMessage);
          this.selectedFile = null;
        },
      });
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.uploadError.emit(message);

    // Clear any existing timeout
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    // Set timeout to hide error after 2 seconds
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.errorTimeout = null;
    }, 2000);
  }

  removeFile() {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemove.emit();
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }
}
