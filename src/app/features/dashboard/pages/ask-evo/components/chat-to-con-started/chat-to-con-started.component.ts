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
import { Router } from '@angular/router';
import { EvoServicesService } from '../../../../services/evo-services.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    sender: string;
    text: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }> = [];

  @Input() selectedFile: File | null = null;
  @Input() selectedFileFromHome: File | null = null;
  @Input() selectedAgent: any;
  @Input() fileUrl!: string | '';
  @Input() isUploading = false;
  @Input() uploadProgress = 0;
  @Input() errorMessage: string | null = null;
  conversationId: string = localStorage.getItem('conversationId') || '';
  userInput: string = '';

  @Output() sendMessage = new EventEmitter<{
    text: string;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() uploadComplete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();
  // @Output() exitChat = new EventEmitter<void>();
  @Output() fileRemove = new EventEmitter<void>();

  private errorTimeout: any; // To store the timeout reference

  @Output() sendMessageToParent = new EventEmitter<any>();

  // contName: string = '';
  constructor(
    private profileService: ProfileServiceService,
    private router: Router,
    private evoService: EvoServicesService
  ) {
    // this.contName = localStorage.getItem('contName')!;
    localStorage.removeItem('serviceId');
    // console.log(localStorage.getItem('serviceId'));
  }

  onSendMessage() {
    if (!this.userInput.trim() && !this.selectedFile) return;

    let attachments:
      | Array<{ name: string; url: string; size: number }>
      | undefined;

    if (this.selectedFile) {
      attachments = [
        {
          name: this.selectedFile.name || 'Unknown File',
          url: '',
          size: this.selectedFile.size,
        },
      ];
      console.log('Selected file:', this.selectedFile);
      console.log('attachments:', attachments);
    }

    this.sendMessage.emit({
      text: this.userInput,
      attachments,
    });

    this.evoService
      .inConversation(this.userInput, this.conversationId, [this.fileUrl || ''])
      .subscribe({
        next: (res: any) => {
          console.log('Response from inConversation:', res);
          if (res) {
            this.messages.push({
              sender: res.agent,
              text: res.content,
              timestamp: new Date(),
            });
            // send the message to parent component
            this.sendMessageToParent.emit({
              sender: res.agent,
              text: res.content,
              timestamp: new Date(),
            });
          }

          // this array hold fully messages between user and consultant
          console.log('Messages after inConversation:', this.messages);
        },
        error: (error: HttpErrorResponse) => {
          console.log('Error in inConversation:', error.error);
        },
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
    this.selectedFileFromHome = null;
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

  exitChat() {
    // localStorage.removeItem('contName');
    // localStorage.removeItem('fileUrl');
    // localStorage.removeItem('contID');
    // localStorage.removeItem('fileName');
    // localStorage.removeItem('fileSize');
    this.router.navigate(['dashboard/ask-evo']);
  }
}
