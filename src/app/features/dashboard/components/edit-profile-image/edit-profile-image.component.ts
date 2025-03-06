import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProfileServiceService } from '../../services/profile-service.service';

@Component({
  selector: 'app-edit-profile-image',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, CommonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-dialog
      [(visible)]="display"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '30vw', minWidth: '300px' }"
      header="Update Profile Picture"
    >
      <div class="flex flex-col gap-4">
        <input
          type="file"
          (change)="onFileChange($event)"
          accept="image/*"
          class="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button
            label="Cancel"
            (click)="onCancel()"
            styleClass="p-button-text"
          ></p-button>
          <p-button
            label="Save"
            (click)="onSave()"
            [loading]="loading"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>
  `,
})
export class EditProfileImageComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() saveImageEvent = new EventEmitter<string>();

  loading: boolean = false;
  selectedFile: File | null = null;
  profileId: string = localStorage.getItem('profileId')!;

  constructor(
    private profileService: ProfileServiceService,
    private messageService: MessageService
  ) {}

  onFileChange(event: any): void {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Image size should not exceed 5MB',
        });
        return;
      }

      this.selectedFile = file;
    }
  }

  onCancel() {
    this.selectedFile = null;
    this.display = false;
    this.displayChange.emit(false);
  }

  onSave() {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an image first',
      });
      return;
    }

    if (this.loading) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.profileService.uploadFile(formData).subscribe({
      next: (response) => {
        if (!response?.Location) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload image',
          });
          this.loading = false;
          return;
        }

        const profileData = {
          profileUrl: response.Location,
        };

        this.profileService
          .editIdentification(this.profileId, profileData)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile image updated successfully',
              });
              this.saveImageEvent.emit(response.Location);
              this.display = false;
              this.displayChange.emit(false);
              this.selectedFile = null;
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update profile image',
              });
            },
            complete: () => {
              this.loading = false;
            },
          });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload image',
        });
        this.loading = false;
      },
    });
  }
}
