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
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

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
    ReactiveFormsModule,
  ],
  templateUrl: './edit-identification.component.html',
  styleUrl: './edit-identification.component.scss',
  providers: [MessageService],
})
export class EditIdentificationComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() profileData!: Profile;
  @Output() saveChangesEvent: EventEmitter<Profile> = new EventEmitter();

  identificationForm!: FormGroup;

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
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getUserDataByUserId();
    this.getAllSkills();
  }

  private initForm() {
    this.identificationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      title: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      selectedSkills: [[], [Validators.required, Validators.minLength(1)]],
    });
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

          // Transform topSkills into the format needed for multiselect
          let selectedSkills: string[] = [];
          if (this.userData.topSkills && this.userData.topSkills.length > 0) {
            selectedSkills = this.userData.topSkills.map(
              (skill: any) => skill.topSkill.translations[0].name
            );
          }

          // Update the form with user data
          this.identificationForm.patchValue({
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            title: this.userData.title,
            country: this.userData.country,
            nationality: this.userData.nationality,
            selectedSkills: selectedSkills,
          });

          console.log(this.userData);
        },
        complete: () => {},
      });
  }

  handleRemoveSkill(skillToRemove: string) {
    const currentSkills =
      this.identificationForm.get('selectedSkills')?.value || [];
    const updatedSkills = currentSkills.filter(
      (skill: string) => skill !== skillToRemove
    );
    this.identificationForm.patchValue({ selectedSkills: updatedSkills });
  }

  closeDialog() {
    this.display = false;
    this.displayChange.emit(this.display);
  }

  getSkillIds(): { topSkillId: string }[] {
    const selectedSkills =
      this.identificationForm.get('selectedSkills')?.value || [];
    return selectedSkills.map((skillName: string) => {
      const skill = this.fullSkillsData.find(
        (s) => s.translations[0].name === skillName
      );
      return { topSkillId: skill.id };
    });
  }

  saveChanges() {
    if (this.identificationForm.invalid) {
      Object.keys(this.identificationForm.controls).forEach((key) => {
        const control = this.identificationForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly',
        contentStyleClass: 'text-white bg-red-900',
        closeIcon: 'pi pi-times text-white',
      });
      return;
    }

    const formValue = this.identificationForm.value;
    const updatedProfile: Profile = {
      firstName: formValue.firstName,
      title: formValue.title,
      lastName: formValue.lastName,
      country: formValue.country,
      nationality: formValue.nationality,
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
            contentStyleClass: 'text-white bg-green-900 ',
            closeIcon: 'pi dark:pi-check text-white',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            contentStyleClass: 'text-white bg-red-900 ',
            closeIcon: 'pi pi-times dark:text-white',
          });
        },
      });
  }
}
