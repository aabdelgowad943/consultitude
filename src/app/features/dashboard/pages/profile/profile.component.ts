import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userId: string = localStorage.getItem('userId')!;
  email: string = '';
  name: string = '';
  title: string = '';
  about: string = '';
  ngOnInit(): void {
    this.getProfileDataByUserId();
  }
  constructor(private authService: AuthService) {}
  getProfileDataByUserId() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.name = res.data.firstName;
        this.title = res.data.title;
        this.about =
          res.data.about ||
          `My journey from engineering to design has taught me the importance
            of collaboration, iteration, and empathy in the design process. I
            believe that great design is not just about making things look
            pretty, but also about solving real problems and enhancing people's
            lives.`;
        this.email = res.data.user?.email;
      },
    });
  }
}
