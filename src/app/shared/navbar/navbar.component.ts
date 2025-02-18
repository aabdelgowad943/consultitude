import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  menuVisible: boolean = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  constructor(private router: Router) {}

  // Getter to determine if red background should be applied
  get shouldApplyRedBg(): boolean {
    const currentUrl = this.router.url;
    const targetPaths = [
      'privacy-and-policy',
      'faqs',
      'about-us',
      'terms-and-conditions',
      'cookie-policy',
    ];
    return targetPaths.some((path) => currentUrl.includes(path));
  }

  // Check if current route is home
  get isHomePath(): boolean {
    return this.router.url === '/home';
  }

  // Check if the user is logged in by looking for the token or user id in localStorage
  get isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!(
        localStorage.getItem('token') || localStorage.getItem('userId')
      );
    }
    return false;
  }

  logout() {
    // Clear the token and user id from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Optionally, you can navigate the user to the login page or home page after logout
    this.router.navigate(['/auth/login']);
  }
}
