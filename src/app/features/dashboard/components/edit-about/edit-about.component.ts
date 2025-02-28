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

  saveChanges() {
    const updatedProfile: Profile = {
      about: this.about,
    };
    this.profileService
      .editIdentification(this.profileId, updatedProfile)
      .subscribe({
        next: (res: any) => {
          this.saveChangesEvent.emit(res);
          this.closeDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Profile updated',
            detail: 'Your profile has been updated successfully.',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile',
          });
        },
      });
    this.saveChangesEvent.emit(this.about);

    this.closeDialog();
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
