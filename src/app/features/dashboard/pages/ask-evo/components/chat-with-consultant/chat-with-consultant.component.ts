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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConsultantSelectorDialogComponent } from '../consultant-selector-dialog/consultant-selector-dialog.component';
import { SelectConsultantForChatComponent } from '../select-consultant-for-chat/select-consultant-for-chat.component';
import {
  AgentFilterParams,
  AgentsService,
} from '../../../../services/agents.service';
import { Consultant } from '../../../../models/consultant';
import { ApiResponseMeta } from '../../../../models/api-response-meta';

@Component({
  selector: 'app-chat-with-consultant',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-consultant.component.html',
  styleUrl: './chat-with-consultant.component.scss',
  providers: [DialogService, DynamicDialogRef],
})
export class ChatWithConsultantComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() selectedFile: File | null = null;
  @Input() isUploading = false;
  @Input() isDragging = false;
  @Input() uploadProgress = 0;
  @Input() errorMessage: string | null = null;

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
  @Output() consultantSelected = new EventEmitter<Consultant[]>();

  // Selected consultants list
  selectedConsultants: Consultant[] = [];

  constructor(
    private profileService: ProfileServiceService,
    private dialogService: DialogService,
    private agentService: AgentsService,
    public dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    // Initialize any necessary data or state here
  }

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
          this.uploadError.emit(errorMessage);
          this.selectedFile = null;
        },
      });
  }

  removeFile() {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemove.emit();
  }

  // Chat functionality methods
  sendMessage(text: string = this.userInput) {
    if (!text.trim() && !this.selectedFile) return;

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

    this.messageSent.emit({
      text,
      attachments,
    });

    this.userInput = ''; // Clear input after sending

    // If there was a file attached, file will be removed after upload completes
    if (!this.selectedFile) {
      this.removeFile();
    }
  }

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

  openConsultantSelector() {
    // Open the dialog with currently selected consultants
    const ref = this.dialogService.open(SelectConsultantForChatComponent, {
      header: 'Select a Consultant',
      width: 'auto',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        selectedConsultants: this.selectedConsultants,
      },
    });

    ref.onClose.subscribe((selectedConsultant: Consultant | null) => {
      if (selectedConsultant) {
        // Check if consultant is already selected
        const existingIndex = this.selectedConsultants.findIndex(
          (c) => c.agentId === selectedConsultant.agentId
        );

        if (existingIndex === -1) {
          // Add to selected consultants if not already there
          this.selectedConsultants.push(selectedConsultant);

          // Emit event to notify parent components
          this.consultantSelected.emit(this.selectedConsultants);

          // Use the selected consultant's suggestion if available
          if (selectedConsultant.type && this.userInput.trim() === '') {
            this.userInput = `I'd like to consult with ${selectedConsultant.type} about: `;

            // Focus on the textarea
            setTimeout(() => {
              const textareaElement = document.querySelector('textarea');
              if (textareaElement) {
                textareaElement.focus();
              }
            }, 0);
          }

          console.log('Selected Consultant:', selectedConsultant);
          console.log(
            'Updated Selected Consultants:',
            this.selectedConsultants
          );
        }
      }
    });
  }
}
