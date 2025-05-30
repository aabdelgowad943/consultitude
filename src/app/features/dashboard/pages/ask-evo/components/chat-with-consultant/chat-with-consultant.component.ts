import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { finalize } from 'rxjs';
import { ProfileServiceService } from '../../../../services/profile-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { SelectConsultantForChatComponent } from '../select-consultant-for-chat/select-consultant-for-chat.component';
import { Consultant } from '../../../../models/consultant';
import { EvoServicesService } from '../../../../services/evo-services.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chat-with-consultant',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-consultant.component.html',
  styleUrl: './chat-with-consultant.component.scss',
  providers: [DialogService, DynamicDialogRef],
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
export class ChatWithConsultantComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() selectedFile: File | null = null;
  @Input() isUploading = false;
  @Input() isDragging = false;
  @Input() uploadProgress = 0;
  @Input() errorMessage: string | null = null;
  @Input() fileUrl: any;

  private errorTimeout: any; // To store the timeout reference

  // Chat functionality properties
  @Input() messages: Array<{
    sender: 'user' | 'consultant';
    text: string;
    timestamp: Date;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }> = [];

  @Input() userInput: string = '';

  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileDragOver = new EventEmitter<DragEvent>();
  @Output() fileDragLeave = new EventEmitter<DragEvent>();
  @Output() fileDrop = new EventEmitter<DragEvent>();
  @Output() fileRemove = new EventEmitter<void>();
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() uploadComplete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();

  // Chat functionality outputs
  @Output() messageSent = new EventEmitter<{
    text: string;
    attachments?: Array<{ name: string; url: string; size: number }>;
  }>();
  @Output() suggestionClicked = new EventEmitter<string>();
  @Output() consultantSelected = new EventEmitter<Consultant>();

  // Selected consultant
  selectedConsultant: Consultant | null = null;

  constructor(
    private profileService: ProfileServiceService,
    private dialogService: DialogService,
    private evoService: EvoServicesService,
    public dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.openConsultantSelector();
  }

  // ------------------------------------------Chat Functionality------------------------------------------
  sendMessage(text: string = this.userInput) {
    if (!text.trim() && !this.selectedFile) return;
    if (!this.selectedConsultant) return; // Ensure a consultant is selected

    let attachments:
      | Array<{ name: string; url: string; size: number }>
      | undefined;

    if (this.selectedFile) {
      attachments = [
        {
          name: this.selectedFile.name || '',
          url: this.fileUrl || '', // Use the stored URL from upload response
          size: this.selectedFile.size,
        },
      ];
    }

    this.messageSent.emit({
      text,
      attachments,
    });

    this.userInput = ''; // Clear input after sending

    // If there was a file attached, remove it after sending
    if (this.selectedFile) {
      this.removeFile();
    }

    const requestBody = {
      // title: text,
      agent_id: this.selectedConsultant?.agentId, // Use single consultant
      docs: [attachments?.[0]?.url || []], // Use the first attachment URL if available
      ask: text,
      owner_id: localStorage.getItem('userId') || '',
      // serviceId: localStorage.getItem('serviceId'),
      // conversationId: 'conversationId22222222',
      // ownerId: localStorage.getItem('profileId') || '',
    };
    // console.log('request body is==========', requestBody);

    this.evoService.makeConversation(requestBody).subscribe({
      next: (res: any) => {
        console.log('Conversation created successfully: not from home', res);
      },
    });
  }
  // ------------------------------------------Chat Functionality--------------------------------------------

  // ---------------------------------------Put text in the text area----------------------------------------
  handleSuggestion(suggestion: string) {
    this.suggestionClicked.emit(suggestion);
    this.userInput = suggestion;

    // Optional: focus on the textarea after setting the suggestion
    setTimeout(() => {
      const textareaElement = document.querySelector('textarea');
      if (textareaElement) {
        textareaElement.focus();
      }
    }, 0);
  }
  // ---------------------------------------Put text in the text area------------------------------------------

  // ---------------------------------------Open Dialog--------------------------------------------------------
  openConsultantSelector() {
    const isMobile = window.innerWidth < 768;
    const dialogWidth = isMobile ? '370px' : '702px';

    const ref = this.dialogService.open(SelectConsultantForChatComponent, {
      header: 'Select a Consultant',
      width: dialogWidth,
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        selectedConsultant: this.selectedConsultant, // Pass single consultant
      },
      height: '90%',
    });

    ref.onClose.subscribe((newConsultant: Consultant | null) => {
      if (newConsultant !== undefined) {
        this.selectedConsultant = newConsultant;

        // Emit event to notify parent components
        this.consultantSelected.emit(this.selectedConsultant!);
      }
    });
  }
  // ---------------------------------------Open Dialog-----------------------------------------------------------

  // ------------------------------------------Upload File Functionality------------------------------------------
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    this.fileDragOver.emit(event);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.fileDragLeave.emit(event);
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
    this.fileUrl = null;

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
            this.fileUrl = response.Location;
            setTimeout(() => {
              this.isUploading = false;
              this.uploadComplete.emit(response.Location);
            }, 500);
          }
        },
        error: (error) => {
          const errorMessage =
            error.error.message || 'Failed to upload file. Please try again.';
          // this.uploadError.emit(errorMessage);
          this.showError(errorMessage);

          this.selectedFile = null;
          this.fileUrl = null; // Clear URL on error
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
    this.fileUrl = null; // Clear URL when removing file
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemove.emit();
  }
  // ------------------------------------------Upload File Functionality------------------------------------------
}
