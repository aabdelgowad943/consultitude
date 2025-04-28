import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { EditIdentificationComponent } from '../../components/edit-identification/edit-identification.component';
import { EditAboutComponent } from '../../components/edit-about/edit-about.component';
import { EditSkillsComponent } from '../../components/edit-skills/edit-skills.component';
import { EditProfileImageComponent } from '../../components/edit-profile-image/edit-profile-image.component';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    EditIdentificationComponent,
    EditAboutComponent,
    EditSkillsComponent,
    EditProfileImageComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userId: string = localStorage.getItem('userId')!;
  loading = true;
  profile: any = {
    skills: {
      industryFocus: [],
      domainFocus: [],
      regionalFocus: [],
    },
  };
  topSkills: string[] = [];
  topSkillsList: string[] = [];
  profileUrl: string = '';

  ngOnInit(): void {
    if (this.userId) {
      // Fetch user profile data
      this.getProfileDataByUserId();
    } else {
      // Handle case where userId is not available
      this.loading = false;
    }
  }

  constructor(private authService: AuthService) {}

  getProfileDataByUserId() {
    this.loading = true; // Ensure loading state is set before API call

    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res && res.data) {
          this.profile = res.data || {
            skills: { industryFocus: [], domainFocus: [], regionalFocus: [] },
          };
          this.topSkillsList = this.extractTopSkills(res.data.topSkills || []);
          this.skillsData = this.profile.skills || {
            industryFocus: [],
            domainFocus: [],
            regionalFocus: [],
          };
          this.name = res.data.firstName || '';
          this.title = res.data.title || '';
          this.about = res.data.about || '';
          this.email = res.data.user?.email || '';
          this.profileUrl = res.data.profileUrl || '';

          // Initialize profile data for editing
          this.initializeProfileData();
        } else {
          // console.warn('No profile data received from API');
          this.handleEmptyProfile();
        }
      },
      error: (err: any) => {
        // console.error('Error fetching profile data:', err);
        this.loading = false;
        this.handleEmptyProfile();
      },
    });
  }

  private handleEmptyProfile() {
    // Set default empty values when profile data is not available
    this.profile = {
      skills: {
        industryFocus: [],
        domainFocus: [],
        regionalFocus: [],
      },
    };
    this.topSkillsList = [];
    this.skillsData = { industryFocus: [], domainFocus: [], regionalFocus: [] };
    this.name = '';
    this.title = '';
    this.about = '';
    this.email = '';
    this.profileUrl = '';

    // Initialize empty profile data for editing
    this.initializeProfileData();
  }

  private initializeProfileData() {
    this.profileData = {
      firstName: this.name || '',
      middleName: '',
      lastName: '',
      phone: '',
      about: this.about || '',
      title: this.title || '',
      profileUrl: this.profileUrl || '',
      thumbnail: '',
      skills: {
        industryFocus: this.profile?.skills?.industryFocus || [],
        domainFocus: this.profile?.skills?.domainFocus || [],
        regionalFocus: this.profile?.skills?.regionalFocus || [],
      },
      email: this.email || '',
      password: '',
    };
  }

  private extractTopSkills(topSkills: any[]): string[] {
    if (!topSkills || !Array.isArray(topSkills)) {
      return [];
    }

    return topSkills
      .map((item) => {
        if (
          item &&
          item.topSkill &&
          item.topSkill.translations &&
          item.topSkill.translations.length > 0
        ) {
          return item.topSkill.translations[0].name || '';
        }
        return '';
      })
      .filter((name) => name !== '');
  }

  // ===============================================edit identify======================================================
  displayEditDialog: boolean = false;
  email: string = '';
  name: string = '';
  title: string = '';
  about: string = '';

  profileData: Profile = {
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    about: '',
    title: '',
    profileUrl: '',
    thumbnail: '',
    skills: {
      industryFocus: [],
      domainFocus: [],
      regionalFocus: [],
    },
    email: '',
    password: '',
  };

  // Local state (including company/nationality if needed elsewhere)
  companyName: string = '';
  nationality: string = '';
  selectedSkills: string[] = [];

  openEditDialog() {
    // Ensure profileData is properly initialized before opening dialog
    this.profileData = {
      ...this.profileData,
      firstName: this.name || '',
      lastName: '', // Get from profile if available
      title: this.title || '',
      about: this.about || '',
      skills: {
        industryFocus: this.profile?.skills?.industryFocus || [],
        domainFocus: this.profile?.skills?.domainFocus || [],
        regionalFocus: this.profile?.skills?.regionalFocus || [],
      },
      email: this.email || '',
    };
    this.displayEditDialog = true;
  }

  onSaveProfileChanges(updatedProfile: Profile) {
    // Update local state from UserProfile
    this.profileData = { ...updatedProfile };

    // Update selectedSkills if needed
    if (updatedProfile.skills && updatedProfile.skills.industryFocus) {
      this.selectedSkills = updatedProfile.skills.industryFocus.map(
        (f) => f.areaOfFocusId
      );
    }

    // Refresh profile data after save
    this.getProfileDataByUserId();
  }

  // ===============================================edit about======================================================
  displayEditAbout: boolean = false;
  aboutText: string = '';

  openEditAbout() {
    this.aboutText = this.about || '';
    this.displayEditAbout = true;
  }

  updateAbout(updatedText: string) {
    this.aboutText = updatedText;
    this.about = updatedText;
    this.displayEditAbout = false;
    // Refresh profile data
    this.getProfileDataByUserId();
  }
  // ===============================================edit about======================================================

  // ===============================================edit skills======================================================
  displayEditSkills: boolean = false;
  skillsData: any = { industryFocus: [], domainFocus: [], regionalFocus: [] };

  openEditSkills() {
    // Ensure skillsData is properly initialized
    this.skillsData = this.profile?.skills || {
      industryFocus: [],
      domainFocus: [],
      regionalFocus: [],
    };
    this.displayEditSkills = true;
  }

  // ===============================================edit skills======================================================

  // ===============================================edit profile image===============================================

  currentImage: string | null = null;
  displayEditImage = false;
  openEditImage() {
    this.currentImage = this.profileUrl || null;
    this.displayEditImage = true;
  }

  onSaveImage(newImage: string) {
    if (newImage) {
      // Update all references to the image URL
      this.currentImage = newImage;
      this.profileUrl = newImage;
      this.profile = {
        ...this.profile,
        profileUrl: newImage,
      };

      // Force change detection by using NgZone
      this.displayEditImage = false;
      // Update the full profile data
      this.getProfileDataByUserId();
    }
  }

  // ===============================================edit profile image===============================================

  // ===============================================collapsing skills===============================================
  showAllIndustrySkills = false;
  showAllDomainSkills = false;
  showAllRegionalSkills = false;
  showAllConsultingSkills = false;

  toggleShowMoreIndustry(): void {
    this.showAllIndustrySkills = !this.showAllIndustrySkills;
  }

  toggleShowMoreDomain(): void {
    this.showAllDomainSkills = !this.showAllDomainSkills;
  }

  toggleShowMoreRegional(): void {
    this.showAllRegionalSkills = !this.showAllRegionalSkills;
  }

  getDomainSkillsToShow(): any[] {
    if (
      !this.profile?.skills?.domainFocus ||
      !Array.isArray(this.profile.skills.domainFocus)
    ) {
      return [];
    }
    return this.showAllDomainSkills
      ? this.profile.skills.domainFocus
      : this.profile.skills.domainFocus.slice(0, 4);
  }

  getRegionalSkillsToShow(): any[] {
    if (
      !this.profile?.skills?.regionalFocus ||
      !Array.isArray(this.profile.skills.regionalFocus)
    ) {
      return [];
    }
    return this.showAllRegionalSkills
      ? this.profile.skills.regionalFocus
      : this.profile.skills.regionalFocus.slice(0, 4);
  }

  getIndustrySkillsToShow(): any[] {
    if (
      !this.profile?.skills?.industryFocus ||
      !Array.isArray(this.profile.skills.industryFocus)
    ) {
      return [];
    }
    return this.showAllIndustrySkills
      ? this.profile.skills.industryFocus
      : this.profile.skills.industryFocus.slice(0, 4);
  }
  // ===============================================collapsing skills===============================================
}
