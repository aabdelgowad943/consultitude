import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ProfileServiceService } from '../../../dashboard/services/profile-service.service';

@Component({
  selector: 'app-edit-ai-consultant',
  standalone: true,
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
  templateUrl: './edit-ai-consultant.component.html',
  providers: [MessageService],
})
export class EditAiConsultantComponent {
  @Input() display: boolean = false;
  @Input() agentData: any;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  consultantForm!: FormGroup;
  maxOutputLength: number = 5000;

  industryFocusOptions = [];
  domainFocusOptions = [];
  regionalFocusOptions = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private profileService: ProfileServiceService
  ) {}

  ngOnInit(): void {
    this.getAllDomains();
    this.getAllIndustries();
    this.getAllRegions();
    this.initForm();
  }

  initForm(): void {
    this.consultantForm = this.fb.group({
      name: [
        this.agentData?.title || '',
        [Validators.required, Validators.minLength(3)],
      ],
      persona: [this.agentData?.persona || '', Validators.required],
      domain: [this.agentData?.domain || '', Validators.required],
      location: [this.agentData?.location || '', Validators.required],
      regional: [this.agentData?.regional || '', Validators.required],
      areaOfFocus: [this.agentData?.areaOfFocus || '', Validators.required],
      output: [
        '',
        [Validators.required, Validators.maxLength(this.maxOutputLength)],
      ],
    });
  }

  // =======================================get all skills=================================
  getAllDomains() {
    this.profileService.getAllDomains(1, 100).subscribe({
      next: (res: any) => {
        this.domainFocusOptions = res.data.map((domain: any) => {
          const name =
            domain.translations && domain.translations.length
              ? domain.translations[0].name
              : 'No Name';
          return {
            domainId: domain.id,
            name: name,
          };
        });
      },
      error: (err: any) => {
        // console.error('Error fetching domains', err);
      },
    });
  }
  getAllIndustries() {
    this.profileService.getAllAraFocus(1, 100).subscribe({
      next: (res: any) => {
        // console.log('Industries:', res.data);
        // Map each item from the industryFocus array
        this.industryFocusOptions = res.data.map((item: any) => {
          const areaOfFocus = item;
          const name =
            areaOfFocus.translations && areaOfFocus.translations.length > 0
              ? areaOfFocus.translations[0].name
              : 'No Name';
          return {
            areaOfFocusId: areaOfFocus.id,
            name: name,
          };
        });
      },
      error: (err: any) => {
        console.error('Error fetching industries', err);
      },
    });
  }

  getAllRegions() {
    this.profileService.getAllRegions(1, 100).subscribe({
      next: (res: any) => {
        // console.log('reg', res.data);
        this.regionalFocusOptions = res.data.map((regionsFocus: any) => {
          const name =
            regionsFocus.translations && regionsFocus.translations.length
              ? regionsFocus.translations[0].name
              : 'No Name';
          // console.log('name', name);

          return {
            regionId: regionsFocus.id, // or you can use domain.translations[0].domainId if preferred
            name: name,
          };
        });
      },
      error: (err: any) => {
        console.error('Error fetching domains', err);
      },
    });
  }
  // =======================================get all skills=================================

  closeDialog(): void {
    this.display = false;
    this.displayChange.emit(false);
  }

  onSubmit(): void {
    if (this.consultantForm.invalid) {
      return;
    }
    // Implement update logic here
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Agent updated successfully',
      key: 'br',
    });
    this.closeDialog();
  }

  get remainingChars(): number {
    const outputControl = this.consultantForm.get('output');
    return outputControl ? outputControl.value?.length || 0 : 0;
  }
}
