import { Component, OnInit } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProfileServiceService } from '../../../dashboard/services/profile-service.service';
import { AgentsService } from '../../../dashboard/services/agents.service';

@Component({
  selector: 'app-edit-ai-consultant',
  standalone: true,
  imports: [
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
export class EditAiConsultantComponent implements OnInit {
  loading = false;
  consultantForm!: FormGroup;
  maxOutputLength: number = 5000;
  agentData: any;

  industryFocusOptions = [];
  domainFocusOptions = [];
  regionalFocusOptions = [];

  // Pattern for non-whitespace validation
  private nonWhitespacePattern = /^(?!\s*$).+/;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private profileService: ProfileServiceService,
    private agentService: AgentsService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    // Get the agent data passed from the dialog service
    this.agentData = this.config.data;
  }

  ngOnInit(): void {
    this.getAllDomains();
    this.getAllIndustries();
    this.initForm();
  }

  initForm(): void {
    this.consultantForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.nonWhitespacePattern), // Prevents only spaces
        ],
      ],
      domains: ['', Validators.required],
      sectors: ['', Validators.required],
      persona: [
        '',
        [
          Validators.required,
          Validators.pattern(this.nonWhitespacePattern), // Prevents only spaces
        ],
      ],
      output: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.maxOutputLength),
          Validators.pattern(this.nonWhitespacePattern), // Prevents only spaces
        ],
      ],
    });

    // Populate form with existing agent data
    if (this.agentData) {
      // Map domain IDs
      const domainIds = this.agentData.domains.map((domain: any) => domain.id);

      // Map sector IDs
      const sectorIds = this.agentData.sectors.map((sector: any) => sector.id);

      // Patch form values
      this.consultantForm.patchValue({
        name: this.agentData.name,
        domains: domainIds,
        sectors: sectorIds,
        output: this.agentData.output,
        persona: this.agentData.persona,
      });
    }
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
        console.error('Error fetching domains', err);
      },
    });
  }

  getAllIndustries() {
    this.profileService.getAllAraFocus(1, 100).subscribe({
      next: (res: any) => {
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
        this.regionalFocusOptions = res.data.map((regionsFocus: any) => {
          const name =
            regionsFocus.translations && regionsFocus.translations.length
              ? regionsFocus.translations[0].name
              : 'No Name';

          return {
            regionId: regionsFocus.id,
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
    this.ref.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    if (this.consultantForm.invalid) {
      this.markFormGroupTouched(this.consultantForm);
      this.loading = false;
      return;
    }

    const formValue = this.consultantForm.value;
    this.agentService
      .updateAgent(this.agentData.id, {
        name: formValue.name,
        output: formValue.output,
        persona: formValue.persona,
        sectors: formValue.sectors,
        domains: formValue.domains,
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Agent updated successfully',
            key: 'br',
            closable: false,
          });
          // Return true to indicate successful update
          this.ref.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Agent update failed',
            key: 'br',
            closable: false,
          });
        },
      });
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  get remainingChars(): number {
    const outputControl = this.consultantForm.get('output');
    return outputControl ? outputControl.value?.length || 0 : 0;
  }
}
