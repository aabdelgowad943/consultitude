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
  profile: any = {};

  ngOnInit(): void {
    this.getProfileDataByUserId();
  }
  constructor(private authService: AuthService) {}
  getProfileDataByUserId() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        // console.log('user profile data is', res.data);
        this.profile = res.data;
        this.skillsData = this.profile.skills;
        this.name = res.data.firstName;
        this.title = res.data.title;
        this.about = res.data.about;
        this.email = res.data.user?.email;
      },
    });
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
    // Map local state to UserProfile structure
    this.profileData = {
      ...this.profileData,
      firstName: this.profileData.firstName,
      lastName: this.profileData.lastName,
      title: this.profileData.title,
      skills: {
        industryFocus: this.selectedSkills.map((skillId) => ({
          areaOfFocusId: skillId,
        })),
        domainFocus: [],
        regionalFocus: [],
      },
    };
    this.displayEditDialog = true;
  }

  onSaveProfileChanges(updatedProfile: Profile) {
    // Update local state from UserProfile
    this.profileData = { ...updatedProfile };
    this.selectedSkills = updatedProfile.skills!.industryFocus.map(
      (f) => f.areaOfFocusId
    );

    // Preserve company/nationality if needed
    // console.log('Updated profile:', updatedProfile);
  }

  // ===============================================edit identify======================================================

  // ===============================================edit about======================================================
  displayEditAbout: boolean = false;
  aboutText: string = 'Your current about text...';

  openEditAbout() {
    this.aboutText = this.about;
    this.displayEditAbout = true;
  }

  updateAbout(updatedText: string) {
    this.aboutText = updatedText;
    this.displayEditAbout = false;
  }
  // ===============================================edit about======================================================

  // ===============================================edit skills======================================================
  displayEditSkills: boolean = false;
  skillsData: any;

  openEditSkills() {
    this.displayEditSkills = true;
  }

  // ===============================================edit skills======================================================

  // ===============================================edit profile image===============================================
  currentImage: string | null = null;
  displayEditImage = false;
  openEditImage() {
    // Optionally set currentImage to some existing base64 if you have it
    this.displayEditImage = true;
  }

  onSaveImage(newImage: string | null) {
    // This is where you get the cropped image from the child
    if (newImage) {
      this.currentImage = newImage;
      // Possibly send it to the server or do something else
    }
  }

  // ===============================================edit profile image===============================================
}
