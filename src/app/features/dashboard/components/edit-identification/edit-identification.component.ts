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
  ],
  templateUrl: './edit-identification.component.html',
  styleUrl: './edit-identification.component.scss',
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
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getUserDataByUserId();
  }

  userData: any;
  getUserDataByUserId() {
    this.authService
      .getUserDataByUserId(localStorage.getItem('userId')!)
      .subscribe({
        next: (res: any) => {
          console.log(res.data);
          this.userData = res.data;
          this.firstName = this.userData.firstName;
          this.title = this.userData.title;
          this.lastName = this.userData.lastName;
          this.selectedSkills = this.profileData.skills!.industryFocus.map(
            (f: any) => f.areaOfFocusId
          );
        },
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
      // ...this.profileData, // Preserve existing data
      firstName: this.firstName,
      title: this.title,
      lastName: this.lastName,
      middleName: this.userData.middleName,
      phone: this.userData.phone,
      about: this.userData.about,
      email: this.userData.user.email,
      profileUrl: this.userData.profileUrl,
      thumbnail: this.userData.thumbnail,
      skills: {
        industryFocus: this.selectedSkills.map((skillId) => ({
          areaOfFocusId: skillId,
        })),
        domainFocus: [], // Add if you have domain selection
        regionalFocus: [], // Add if you have region selection
      },
    };

    // console.log('hh', updatedProfile);

    this.profileService
      .editIdentification(localStorage.getItem('userId')!, updatedProfile)
      .subscribe({
        next: (res: any) => {
          this.saveChangesEvent.emit(res);
          this.closeDialog();
        },
        error: (err) => {
          console.error('Update failed:', err);
        },
      });
  }
}
