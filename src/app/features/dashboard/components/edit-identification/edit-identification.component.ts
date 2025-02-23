import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { ProfileServiceService } from '../../services/profile-service.service';
import { Profile } from '../../models/profile';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-identification',
  imports: [
    DialogModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    CommonModule,
    ChipModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './edit-identification.component.html',
  styleUrl: './edit-identification.component.scss',
  providers: [MessageService],
})
export class EditIdentificationComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() profileData!: Profile; // Use the UserProfile interface
  @Output() saveChangesEvent: EventEmitter<Profile> = new EventEmitter();

  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  phone: string = '';
  about: string = '';
  title: string = '';
  email: string = '';
  selectedSkills: string[] = [];

  skills = [
    { label: 'Strategy', value: 'Strategy' },
    { label: 'Design', value: 'Design' },
    { label: 'Delivery', value: 'Delivery' },
  ];

  constructor(
    private profileService: ProfileServiceService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getUserDataByUserId();
  }

  userData: any;
  profileId: string = '';
  getUserDataByUserId() {
    this.authService
      .getUserDataByUserId(localStorage.getItem('userId')!)
      .subscribe({
        next: (res: any) => {
          console.log(res.data);
          this.profileId = res.data.id;
          this.userData = res.data;
          this.firstName = this.userData.firstName;
          this.title = this.userData.title;
          this.lastName = this.userData.lastName;
          this.selectedSkills = this.profileData.skills!.industryFocus.map(
            (f: any) => f.areaOfFocusId
          );
        },
        complete: () => {},
      });
  }

  handleRemoveSkill(skillToRemove: string) {
    this.selectedSkills = this.selectedSkills.filter(
      (skill) => skill !== skillToRemove
    );
  }

  closeDialog() {
    this.display = false;
    this.displayChange.emit(this.display);
  }

  saveChanges() {
    const updatedProfile: Profile = {
      firstName: this.firstName,
      title: this.title,
      lastName: this.lastName,
      middleName: this.userData.middleName,
      phone: this.userData.phone,
      about: this.userData.about,
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
  }
}
