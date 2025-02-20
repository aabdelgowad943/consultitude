import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-edit-skills',
  imports: [
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    ChipModule,
  ],
  templateUrl: './edit-skills.component.html',
  styleUrl: './edit-skills.component.scss',
})
export class EditSkillsComponent {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() skillsData: any = {
    industryFocus: [],
    domainFocus: [],
    regionalFocus: [],
    consultingSkills: [],
  };

  @Output() saveChangesEvent: EventEmitter<any> = new EventEmitter<any>();

  // Local arrays of selected IDs for each category
  industryFocusSelected: string[] = [];
  domainFocusSelected: string[] = [];
  regionalFocusSelected: string[] = [];
  consultingSkillsSelected: string[] = [];

  // =================Options for multiSelect (update these arrays as needed)============================
  industryFocusOptions = [
    {
      areaOfFocusId: '637da527-c900-4aa9-8560-90a8f0fb672c',
      name: 'Real estate',
    },
    { areaOfFocusId: 'id2', name: 'Finance' },
    { areaOfFocusId: 'id3', name: 'Technology' },
    { areaOfFocusId: 'id4', name: 'Healthcare' },
  ];

  domainFocusOptions = [
    { domainId: 'bb9e69be-e999-4698-80fb-5b799f158382', name: 'Real estate' },
    { domainId: 'd2', name: 'Finance' },
    { domainId: 'd3', name: 'Technology' },
    { domainId: 'd4', name: 'Healthcare' },
  ];

  regionalFocusOptions = [
    { regionId: '76b98ba8-7fc9-425f-978b-3c01e8b83a57', name: 'North America' },
    { regionId: 'r2', name: 'Europe' },
    { regionId: 'r3', name: 'Asia' },
    { regionId: 'r4', name: 'Africa' },
  ];

  consultingFocusOptions = [
    {
      consultingId: '76b98ba8-7fc9-425f-978b-3c01e8b83a57s',
      name: 'North America',
    },
    { consultingId: 'c2', name: 'Real state' },
    { consultingId: 'c3', name: 'Real state' },
    { consultingId: 'c4', name: 'Real state' },
  ];
  // =================Options for multiSelect (update these arrays as needed)============================

  ngOnInit() {
    // Convert the input skillsData into local arrays of IDs
    if (this.skillsData.industryFocus) {
      this.industryFocusSelected = this.skillsData.industryFocus.map(
        (item: any) => item.areaOfFocusId
      );
    }
    if (this.skillsData.domainFocus) {
      this.domainFocusSelected = this.skillsData.domainFocus.map(
        (item: any) => item.domainId
      );
    }
    if (this.skillsData.regionalFocus) {
      this.regionalFocusSelected = this.skillsData.regionalFocus.map(
        (item: any) => item.regionId
      );
    }
    if (this.skillsData.consultingSkills) {
      this.consultingSkillsSelected = this.skillsData.consultingSkills.map(
        (item: any) => item.consultingId
      );
    }
  }

  // ===================================Methods to lookup display names for chips===================
  getIndustryName(id: string): string {
    const option = this.industryFocusOptions.find(
      (o) => o.areaOfFocusId === id
    );
    return option ? option.name : '';
  }

  getDomainName(id: string): string {
    const option = this.domainFocusOptions.find((o) => o.domainId === id);
    return option ? option.name : '';
  }

  getRegionalName(id: string): string {
    const option = this.regionalFocusOptions.find((o) => o.regionId === id);
    return option ? option.name : '';
  }

  getConsultingName(id: string): string {
    const option = this.consultingFocusOptions.find(
      (o) => o.consultingId === id
    );
    return option ? option.name : '';
  }
  // ===================================Methods to lookup display names for chips===================

  // ===================================Methods to remove chips===================
  handleRemoveIndustry(skillId: string) {
    this.industryFocusSelected = this.industryFocusSelected.filter(
      (id) => id !== skillId
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

  handleRemoveConsulting(skillId: string) {
    this.consultingSkillsSelected = this.consultingSkillsSelected.filter(
      (id) => id !== skillId
    );
  }
  // ===================================Methods to remove chips===================

  saveChanges() {
    // Transform local selections back into the required object shape
    const updatedSkills = {
      industryFocus: this.industryFocusSelected.map((id) => ({
        areaOfFocusId: id,
      })),
      domainFocus: this.domainFocusSelected.map((id) => ({ domainId: id })),
      regionalFocus: this.regionalFocusSelected.map((id) => ({ regionId: id })),
      consultingSkills: this.consultingSkillsSelected.map((id) => ({
        consultingId: id,
      })),
    };

    this.saveChangesEvent.emit(updatedSkills);
    this.closeDialog();
  }

  closeDialog() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
