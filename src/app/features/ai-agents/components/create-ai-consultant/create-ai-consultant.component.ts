import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { Profile } from '../../../dashboard/models/profile';
import { ProfileServiceService } from '../../../dashboard/services/profile-service.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { AgentsService } from '../../../dashboard/services/agents.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-ai-consultant',
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
  templateUrl: './create-ai-consultant.component.html',
  styleUrl: './create-ai-consultant.component.scss',
  providers: [MessageService],
})
export class CreateAiConsultantComponent {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() onModalChange = new EventEmitter<boolean>();

  @Output() saveChangesEvent: EventEmitter<Profile> = new EventEmitter();

  consultantForm!: FormGroup;

  maxOutputLength: number = 5000;

  // =================Options for multiSelect============================
  industryFocusOptions = [];

  domainFocusOptions = [];

  regionalFocusOptions = [];

  // Local arrays of selected IDs for each category
  industryFocusSelected: string[] = [];
  domainFocusSelected: string[] = [];
  regionalFocusSelected: string[] = [];
  consultingSkillsSelected: string[] = [];

  profileId: string = localStorage.getItem('profileId') || '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private profileService: ProfileServiceService,
    private agentService: AgentsService
  ) {}

  ngOnInit(): void {
    this.getAllDomains();
    this.getAllIndustries();
    this.getAllRegions();
    this.initForm();
  }

  initForm(): void {
    this.consultantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      persona: ['', Validators.required],
      domains: ['', Validators.required],
      // location: ['', Validators.required],
      // regional: ['', Validators.required],
      sectors: ['', Validators.required],
      output: [
        '',
        [Validators.required, Validators.maxLength(this.maxOutputLength)],
      ],
      profileId: [this.profileId],
    });
  }

  get remainingChars(): number {
    const outputControl = this.consultantForm.get('output');
    return outputControl ? outputControl.value?.length || 0 : 0;
  }

  onSubmit(): void {
    if (this.consultantForm.invalid) {
      this.markFormGroupTouched(this.consultantForm);
      this.messageService.add({
        severity: 'warn', // changed from 'error' to 'warn' to match orange icon
        summary: 'Something Went Wrong',
        detail:
          "We couldn't create your AI Agent. Please check your inputs or try again later. If the issue persists, contact support for assistance.",
        key: 'br',
        life: 5000,
        styleClass: 'custom-toast',
      });

      return;
    }
    const consultantData = this.consultantForm.value;
    this.agentService.createAgent(consultantData).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success Message',
          detail: res.message,
          key: 'br',
          life: 3000,
        });
        this.onModalChange.emit();

        this.consultantForm.reset();
        // close the dialog
        this.display = false;
      },
      error: (err) => {
        console.log(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Failed to create',
          key: 'br',
          life: 3000,
        });
      },
    });
  }

  closeDialog(): void {
    this.display = false;
    this.displayChange.emit(false);
    this.consultantForm.reset();
  }

  // ===================================Methods to lookup display names for chips===================
  getIndustryName(areaOfFocusId: string): string {
    const industry = this.industryFocusOptions.find(
      (i: any) => i.areaOfFocusId === areaOfFocusId
    ) as any;
    return industry ? industry.name : areaOfFocusId;
  }

  getDomainName(domainId: string): string {
    const domain = this.domainFocusOptions.find(
      (d: any) => d.domainId === domainId
    ) as any;
    return domain ? domain.name : domainId;
  }

  getRegionalName(regionId: string): string {
    const option = this.regionalFocusOptions.find(
      (o: any) => o.regionId === regionId
    ) as any;
    return option ? option.name : regionId;
  }

  // ==============================================================================================

  // ===================================Methods to remove chips===================
  handleRemoveIndustry(id: string) {
    this.industryFocusSelected = this.industryFocusSelected.filter(
      (item: any) => item !== id
    );
  }

  handleRemoveDomain(skillId: string) {
    this.domainFocusSelected = this.domainFocusSelected.filter(
      (id) => id !== skillId
    );
  }

  handleRemoveRegion(skillId: string) {
    this.regionalFocusSelected = this.regionalFocusSelected.filter(
      (id) => id !== skillId
    );
  }
  // ===================================Methods to remove chips===================

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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }
}
