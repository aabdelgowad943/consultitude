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
  country: string = '';
  nationality: string = '';

  skills: any[] = [];
  fullSkillsData: any[] = [];

  nationalities: any[] = [
    { label: 'Egyptian', value: 'Egyptian' },
    { label: 'Saudi Arabian', value: 'Saudi Arabian' },
    { label: 'Emirati', value: 'Emirati' },
    { label: 'Kuwaiti', value: 'Kuwaiti' },
    { label: 'Qatari', value: 'Qatari' },
    { label: 'Omani', value: 'Omani' },
    { label: 'Bahraini', value: 'Bahraini' },
    { label: 'Jordanian', value: 'Jordanian' },
    { label: 'Lebanese', value: 'Lebanese' },
    { label: 'Syrian', value: 'Syrian' },
    { label: 'Iraqi', value: 'Iraqi' },
    { label: 'Palestinian', value: 'Palestinian' },
    { label: 'Sudanese', value: 'Sudanese' },
    { label: 'Algerian', value: 'Algerian' },
    { label: 'Moroccan', value: 'Moroccan' },
    { label: 'Tunisian', value: 'Tunisian' },
    { label: 'Libyan', value: 'Libyan' },
    { label: 'Yemeni', value: 'Yemeni' },
  ];

  constructor(
    private profileService: ProfileServiceService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getUserDataByUserId();
    this.getAllSkills();
  }

  getAllSkills() {
    this.profileService.getAllSkills().subscribe({
      next: (res: any) => {
        this.fullSkillsData = res.data;
        this.skills = res.data.map((skill: any) => ({
          label: skill.translations[0].name,
          value: skill.translations[0].name,
        }));
        console.log(this.skills);
      },
      complete: () => {},
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

          this.firstName = this.userData.firstName;
          this.title = this.userData.title;
          this.lastName = this.userData.lastName;
          this.country = this.userData.country;
          this.nationality = this.userData.nationality;

          // Transform topSkills into the format needed for multiselect
          if (this.userData.topSkills && this.userData.topSkills.length > 0) {
            this.selectedSkills = this.userData.topSkills.map(
              (skill: any) => skill.topSkill.translations[0].name
            );
          }

          console.log(this.userData);
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

  getSkillIds(): { topSkillId: string }[] {
    return this.selectedSkills.map((skillName) => {
      const skill = this.fullSkillsData.find(
        (s) => s.translations[0].name === skillName
      );
      return { topSkillId: skill.id };
    });
  }

  saveChanges() {
    const updatedProfile: Profile = {
      firstName: this.firstName,
      title: this.title,
      lastName: this.lastName,
      middleName: this.userData.middleName,
      phone: this.userData.phone,
      about: this.userData.about,
      country: this.country,
      nationality: this.nationality,
      topSkills: this.getSkillIds(),
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
