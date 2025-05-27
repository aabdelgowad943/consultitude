import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Profile } from '../../models/profile';
import { ProfileServiceService } from '../../services/profile-service.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-about',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    CommonModule,
  ],
  templateUrl: './edit-about.component.html',
  styleUrl: './edit-about.component.scss',
  providers: [MessageService],
})
export class EditAboutComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() set about(value: string) {
    if (this.aboutForm) {
      this.aboutForm.patchValue({ about: value || '' });
    }
    this._about = value || '';
  }
  get about(): string {
    return this._about;
  }
  private _about: string = '';

  @Output() saveChangesEvent: EventEmitter<string> = new EventEmitter();

  aboutForm!: FormGroup;
  formSubmitted: boolean = false;

  constructor(
    private profileService: ProfileServiceService,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getUserDataByUserId();
  }

  private initForm() {
    // Custom validator for whitespace-only text
    const noWhitespaceValidator = (control: { value: string }) => {
      const isWhitespace = control.value && control.value.trim().length === 0;
      return !isWhitespace ? null : { whitespace: true };
    };

    this.aboutForm = this.fb.group({
      about: [
        this._about || '',
        [Validators.required, Validators.maxLength(300), noWhitespaceValidator],
      ],
    });
  }

  get aboutControl() {
    return this.aboutForm.get('about');
  }

  getCharCount(): number {
    return this.aboutControl?.value?.length || 0;
  }

  saveChanges() {
    this.formSubmitted = true;

    if (this.aboutForm.invalid) {
      return;
    }

    const trimmedAbout = this.aboutControl?.value.trim();
    const updatedProfile: Profile = { about: trimmedAbout };

    this.profileService
      .editIdentification(this.profileId, updatedProfile)
      .subscribe({
        next: () => {
          this.saveChangesEvent.emit(trimmedAbout);
          this.closeDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Profile updated',
            // detail: 'Your "About" section has been saved.',
            // contentStyleClass: 'text-white bg-green-900',
            closeIcon: 'pi pi-check text-white',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update your profile. Please try again.',
            contentStyleClass: 'text-white bg-red-900',
            closeIcon: 'pi pi-times text-white',
          });
        },
      });
  }

  userData: any;
  profileId: string = '';
  getUserDataByUserId() {
    this.authService
      .getUserDataByUserId(localStorage.getItem('userId')!)
      .subscribe({
        next: (res: any) => {
          this.profileId = res.data.id;
          this.userData = res.data;

          // Initialize the form with the user data
          if (this.userData && this.userData.about) {
            this.aboutForm.patchValue({ about: this.userData.about });
          }
        },
        complete: () => {},
      });
  }

  closeDialog() {
    this.display = false;
    this.formSubmitted = false;
    this.displayChange.emit(this.display);
  }
}
