import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { ProfileServiceService } from '../../services/profile-service.service';
import { AuthService } from '../../../auth/services/auth.service';

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
export class EditProfileImageComponent implements OnInit {
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

  constructor(
    private profileService: ProfileServiceService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialImage'] && this.initialImage) {
      this.croppedImage = null;
    }
  }
  ngOnInit(): void {
    this.getUserDataByUserId();
  }
  onFileChange(event: any): void {
    this.imageChangedEvent = event;

    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Store the base64 as a fallback
        this.initialImage = e.target.result;

        // If cropping fails, use this directly
        if (!this.croppedImage) {
          this.croppedImage = e.target.result;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64 || null;
  }
  onZoomChange() {}

  onCancel() {
    this.display = false;
    this.displayChange.emit(false);
  }

  onSave() {
    const imageToSave = this.croppedImage || this.initialImage;

    if (!imageToSave) {
      console.log('No image to save');
      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    const file = this.convertBase64ToFile(imageToSave);
    if (!file) {
      this.loading = false;
      console.error('Failed to convert image');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.profileService.uploadFile(formData).subscribe({
      next: (response) => {
        if (!response?.Location) {
          console.error('No URL in response');
          this.loading = false;
          return;
        }

        const profileData = {
          profileUrl: response.Location,
        };

        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.log('No user ID found');
          this.loading = false;
          return;
        }

        this.profileService
          .editIdentification(this.profileId, profileData)
          .subscribe({
            next: (response: any) => {
              console.log('res', response);

              this.saveImageEvent.emit(response.Location);
              this.display = false;
              this.displayChange.emit(false);
              this.loading = false;
            },
            error: (error) => {
              console.log('Error updating profile:', error.error);
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

  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.log('Load image failed');
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

  userData: any;
  profileId: string = '';
  getUserDataByUserId() {
    this.authService
      .getUserDataByUserId(localStorage.getItem('userId')!)
      .subscribe({
        next: (res: any) => {
          // console.log(res.data);
          this.profileId = res.data.id;
          this.userData = res.data;
        },
        complete: () => {},
      });
  }
}
