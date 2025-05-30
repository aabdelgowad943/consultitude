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
  template: ` <p-dialog
      [(visible)]="display"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="bg-white text-black"
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
            file:text-sm file:ipad:font-[500] big:font-[600]
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100 bg-white px-4"
        />

        <!-- Image Preview -->
        <div *ngIf="imagePreviewUrl" class="mt-4 flex justify-center">
          <img
            [src]="imagePreviewUrl"
            alt="Profile Preview"
            class="max-w-full max-h-64 rounded-md object-cover border border-gray-200 shadow-sm"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button
            label="Cancel"
            (click)="onCancel()"
            styleClass="border border-[#EAECF0] rounded-lg text-gray-800 bg-transparent outline-none "
          ></p-button>
          <p-button
            label="Save"
            styleClass="bg-[#7F56D9] hover:bg-[#a24af5] text-white rounded-lg outline-none border border-none"
            (click)="onSave()"
            [loading]="loading"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>
    <p-toast></p-toast>`,
})
export class EditProfileImageComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() saveImageEvent = new EventEmitter<string>();

  loading: boolean = false;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
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

      // Create a preview URL for the selected image
      this.createImagePreview(file);
    }
  }

  createImagePreview(file: File): void {
    // Revoke the previous URL if it exists to prevent memory leaks
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    // Create a new URL for the selected file
    this.imagePreviewUrl = URL.createObjectURL(file) || 'images/profile.png';
  }

  onCancel() {
    this.resetComponent();
  }

  resetComponent() {
    // Clean up the object URL to prevent memory leaks
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
      this.imagePreviewUrl = null;
    }

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
                // detail: 'Profile image updated successfully',
                contentStyleClass: 'text-white bg-green-900 ',
                closeIcon: 'pi dark:pi-check text-white',
              });
              this.saveImageEvent.emit(response.Location);
              this.resetComponent();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                // detail: 'Failed to update profile image',
                contentStyleClass: 'text-white bg-red-900 ',
                closeIcon: 'pi pi-times dark:text-white',
              });
              this.loading = false;
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
          contentStyleClass: 'text-white bg-red-900 ',
          closeIcon: 'pi pi-times dark:text-white',
        });
        this.loading = false;
      },
    });
  }

  ngOnDestroy() {
    // Clean up any object URLs when the component is destroyed
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }
}
