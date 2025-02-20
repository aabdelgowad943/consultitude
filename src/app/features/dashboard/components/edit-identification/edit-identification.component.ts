import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';

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
export class EditIdentificationComponent {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() profileData: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    companyName: string;
    nationality: string;
    selectedSkills: string[];
  } = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    companyName: '',
    nationality: '',
    selectedSkills: [],
  };

  @Output() saveChangesEvent: EventEmitter<{
    firstName: string;
    lastName: string;
    jobTitle: string;
    companyName: string;
    nationality: string;
    selectedSkills: string[];
  }> = new EventEmitter();

  firstName: string = '';
  lastName: string = '';
  jobTitle: string = '';
  companyName: string = '';
  nationality: string = '';
  selectedSkills: string[] = [];

  titles = [
    { label: 'Software Engineer', value: 'Software Engineer' },
    { label: 'Product Manager', value: 'Product Manager' },
    { label: 'Designer', value: 'Designer' },
  ];

  skills = [
    { label: 'Strategy', value: 'Strategy' },
    { label: 'Design', value: 'Design' },
    { label: 'Delivery', value: 'Delivery' },
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileData'] && this.profileData) {
      this.firstName = this.profileData.firstName;
      this.lastName = this.profileData.lastName;
      this.jobTitle = this.profileData.jobTitle;
      this.companyName = this.profileData.companyName;
      this.nationality = this.profileData.nationality;
      this.selectedSkills = [...this.profileData.selectedSkills];
    }
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
    this.saveChangesEvent.emit({
      firstName: this.firstName,
      lastName: this.lastName,
      jobTitle: this.jobTitle,
      companyName: this.companyName,
      nationality: this.nationality,
      selectedSkills: this.selectedSkills,
    });
    this.closeDialog();
  }
}
