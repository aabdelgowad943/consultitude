import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe({
      next: (params) => {
        console.log('Received params:', params); // Debug received params

        const token = params['token'];
        const name = params['name'];
        const email = params['email'];

        console.log('Token received:', token ? 'Yes' : 'No'); // Debug token presence

        if (!token) {
          console.error('No token received in params');
          return;
        }

        try {
          // Store the token and user info
          localStorage.setItem('token', token);
          localStorage.setItem('name', name);
          localStorage.setItem('email', email);

          console.log('Attempting to decode token...'); // Debug decode attempt
          const decodedToken = jwtDecode<DecodedToken>(token);
          console.log('Decoded token:', decodedToken); // Debug decoded content

          if (decodedToken && decodedToken.id) {
            localStorage.setItem('userId', decodedToken.id);
            console.log('Successfully stored userId:', decodedToken.id);
            this.router.navigate(['/dashboard']);
          } else {
            console.error('No user ID found in decoded token');
          }
        } catch (error) {
          console.error('Error processing token:', error);
          // Optionally redirect to error page or show error message
        }
      },
      error: (error) => {
        console.error('Error in query params subscription:', error);
      },
    });
  }
}
