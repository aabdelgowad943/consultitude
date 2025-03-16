import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../features/auth/services/auth.service';

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  // add other expected token fields here
}

@Component({
  selector: 'app-linkedin-callback',
  imports: [],
  templateUrl: './linkedin-callback.component.html',
  styleUrl: './linkedin-callback.component.scss',
})
export class LinkedinCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe({
      next: (params) => {
        const token = params['token'];
        const name = params['name'];
        const email = params['email'];

        if (!token) {
          console.error('No token received in params');
          return;
        }

        try {
          // Store the token and user info
          localStorage.setItem('token', token);
          localStorage.setItem('name', name);
          localStorage.setItem('email', email);

          const decodedToken = jwtDecode<DecodedToken>(token);

          if (decodedToken && decodedToken.id) {
            localStorage.setItem('userId', decodedToken.id);
            this.localStorageStoring(decodedToken.id);
            this.router.navigate(['/dashboard']);
          } else {
            console.error('No user ID found in decoded token');
          }
        } catch (error) {
          console.error('Error processing token:', error);
          // Optionally redirect to error page or show error message
        }
      },
      complete: () => {
        this.localStorageStoring(localStorage.getItem('userId')!);
      },
      error: (error) => {
        console.error('Error in query params subscription:', error);
      },
    });
  }

  localStorageStoring(userId: string) {
    this.authService.getUserDataByUserId(userId).subscribe({
      next: (res: any) => {
        const profileId = localStorage.setItem('profileId', res.data.id);
        // console.log(profileId);
      },
    });
  }
}
