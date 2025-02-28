import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { ProfileServiceService } from '../../services/profile-service.service';

@Component({
  selector: 'app-edit-profile-image',
  imports: [
    DialogModule,
    ButtonModule,
    ImageCropperComponent,
    SliderModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './edit-profile-image.component.html',
  styleUrl: './edit-profile-image.component.scss',
})
export class EditProfileImageComponent {
  @Input() display: boolean = false; // Controls the visibility of the dialog
  @Output() displayChange = new EventEmitter<boolean>();

  // The original image to crop (as File or base64)
  @Input() initialImage: string | null = null;

  // The final cropped image (base64)
  @Output() saveImageEvent = new EventEmitter<string | null>();

  // Local state
  imageChangedEvent: any = '';
  croppedImage: string | null = null;

  // Zoom slider value (0 - 100 for example)
  zoomValue: number = 50;

  loading: boolean = false;

  constructor(private profileService: ProfileServiceService) {}

  // Called when the parent updates `initialImage`
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialImage'] && this.initialImage) {
      // If we are receiving a base64 or a new image file, reset the cropper
      this.croppedImage = null;
      // Optionally set the imageChangedEvent if it's base64
      // If it's a file, you would handle that differently
    }
  }

  /**
   * When user selects a new file from input type="file"
   */
  onFileChange(event: any): void {
    this.imageChangedEvent = event;
  }

  /**
   * ngx-image-cropper emits this event whenever the image is cropped
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 || null;
  }

  /**
   * If you want to handle zoom manually using the slider, you can
   * adjust cropper settings in the template or recalculate here.
   * For simplicity, we rely on built-in 'zoom' from the library.
   */
  onZoomChange() {
    // You can integrate this.zoomValue with the cropper in the template if needed.
  }

  /**
   * Close the dialog
   */
  onCancel() {
    this.display = false;
    this.displayChange.emit(false);
  }

  /**
   * Save the cropped image
   */

  onSave() {
    if (!this.croppedImage) {
      console.error('No image to save');
      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    const file = this.convertBase64ToFile(this.croppedImage);
    if (!file) {
      this.loading = false;
      console.error('Failed to convert image');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.profileService.uploadFile(formData).subscribe({
      next: (response) => {
        if (!response?.url) {
          console.error('No URL in response');
          this.loading = false;
          return;
        }

        const profileData = {
          profileUrl: response.url,
        };

        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No user ID found');
          this.loading = false;
          return;
        }

        this.profileService.editIdentification(userId, profileData).subscribe({
          next: (updatedProfile) => {
            this.saveImageEvent.emit(response.url);
            this.display = false;
            this.displayChange.emit(false);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        this.loading = false;
      },
    });
  }

  private convertBase64ToFile(base64Image: string): File | null {
    try {
      const split = base64Image.split(',');
      const base64Data = split.length > 1 ? split[1] : split[0];
      const blob = this.base64ToBlob(base64Data, 'image/png');
      if (!blob) return null;
      return new File([blob], 'profile-image.png', { type: 'image/png' });
    } catch (error) {
      console.error('Error converting base64 to file:', error);
      return null;
    }
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
