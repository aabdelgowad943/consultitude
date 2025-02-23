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
    this.saveImageEvent.emit(this.croppedImage);
    this.display = false;
    this.displayChange.emit(false);
    // console.log(this.initialImage);
  }
}
