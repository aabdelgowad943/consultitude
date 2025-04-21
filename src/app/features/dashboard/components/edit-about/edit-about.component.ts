import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Profile } from '../../models/profile';
import { ProfileServiceService } from '../../services/profile-service.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-about',
  imports: [DialogModule, FormsModule, ButtonModule, ToastModule],
  templateUrl: './edit-about.component.html',
  styleUrl: './edit-about.component.scss',
  providers: [MessageService],
})
export class EditAboutComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() about: string = ''; // Initialize with empty string
  @Output() saveChangesEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    private profileService: ProfileServiceService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getUserDataByUserId();
    // Ensure about is never null
    if (!this.about) {
      this.about = '';
    }
  }

  /** Helper: returns true if the string is all whitespace (or empty) */
  private isOnlyWhitespace(value: string): boolean {
    return !value || value.trim().length === 0;
  }

  saveChanges() {
    // 1) Trim once up front
    const trimmed = this.about.trim();

    // 2) Reject if nothing left after trimming
    if (this.isOnlyWhitespace(trimmed)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid input',
        detail: 'About section cannot be blank or contain only spaces.',
        life: 3000,
        closable: false,
      });
      return;
    }

    // 3) Build your payload with the trimmed value
    const updatedProfile: Profile = { about: trimmed };

    // 4) Call service
    this.profileService
      .editIdentification(this.profileId, updatedProfile)
      .subscribe({
        next: () => {
          this.saveChangesEvent.emit(trimmed);
          this.closeDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Profile updated',
            detail: 'Your “About” section has been saved.',
            contentStyleClass: 'text-white bg-green-900',
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
          // console.log(res.data);
          this.profileId = res.data.id;
          this.userData = res.data;
        },
        complete: () => {},
      });
  }

  closeDialog() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
