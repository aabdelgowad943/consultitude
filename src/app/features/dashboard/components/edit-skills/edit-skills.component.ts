import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProfileServiceService } from '../../services/profile-service.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Profile } from '../../models/profile';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-skills',
  imports: [
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    ChipModule,
    ToastModule,
  ],
  templateUrl: './edit-skills.component.html',
  styleUrl: './edit-skills.component.scss',
  providers: [MessageService],
})
export class EditSkillsComponent implements OnChanges, OnInit {
  constructor(
    private profileService: ProfileServiceService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllDomains();
    this.getAllIndustries();
    this.getAllRegions();
    this.getUserDataByUserId();
  }

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

  // =================Options for multiSelect============================
  industryFocusOptions = [];

  domainFocusOptions = [];

  regionalFocusOptions = [];

  consultingFocusOptions = [
    {
      consultingId: '76b98ba8-7fc9-425f-978b-3c01e8b83a57s',
      name: 'Consulting 1',
    },
    { consultingId: 'c2', name: 'Consulting 2' },
    { consultingId: 'c3', name: 'Consulting 3' },
    { consultingId: 'c4', name: 'Consulting 4' },
  ];
  // =====================================================================
  ngOnChanges(changes: SimpleChanges) {
    if (changes['skillsData'] && changes['skillsData'].currentValue) {
      const data = changes['skillsData'].currentValue;
      // console.log('Current value is', data);

      this.industryFocusSelected = data.industryFocus
        ? data.industryFocus.map((item: any) => item.areaOfFocus.id)
        : [];

      this.domainFocusSelected = data.domainFocus
        ? data.domainFocus.map((item: any) => item.domain.id)
        : [];

      this.regionalFocusSelected = data.regionalFocus
        ? data.regionalFocus.map((item: any) => item.region.id)
        : [];

      this.consultingSkillsSelected = data.consultingSkills
        ? data.consultingSkills.map((item: any) => item.consultingId)
        : [];
    }
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

  getConsultingName(id: string): string {
    const option = this.consultingFocusOptions.find(
      (o) => o.consultingId === id
    );
    return option && option.name ? option.name : id;
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

  handleRemoveConsulting(skillId: string) {
    this.consultingSkillsSelected = this.consultingSkillsSelected.filter(
      (id) => id !== skillId
    );
  }
  // ===================================Methods to remove chips===================

  // ===================================Submit function===========================
  saveChanges() {
    const updatedSkills = {
      industryFocus: this.industryFocusSelected.map((id) => ({
        areaOfFocusId: id,
      })),
      domainFocus: this.domainFocusSelected.map((id) => ({ domainId: id })),
      regionalFocus: this.regionalFocusSelected.map((id) => ({ regionId: id })),
      // consultingSkills: this.consultingSkillsSelected.map((id) => ({
      //   consultingId: id,
      // })),
    };
    const updatedProfile = {
      skills: updatedSkills,
    };

    this.profileService
      .editIdentification(this.profileId, updatedProfile)
      .subscribe({
        next: (profile: Profile) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Profile updated',
            detail: 'Your profile has been updated successfully.',
          });
          this.userData = profile;
          this.saveChangesEvent.emit(profile.skills);
          this.closeDialog();
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile',
          });
        },
      });
  }
  // ===================================Submit function===========================

  closeDialog() {
    this.display = false;
    this.displayChange.emit(this.display);
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

  // =======================================get profile data=================================
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
  // =======================================get profile data=================================
}
