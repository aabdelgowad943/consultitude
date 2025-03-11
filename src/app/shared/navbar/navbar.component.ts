import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  menuVisible: boolean = false;
  userId: string = localStorage.getItem('userId')!;
  name: string = '';
  email: string = '';
  isDropdownOpen: boolean = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const dropdown = document.getElementById('dropdown');
    const menuButton = document.getElementById('user-menu-button');

    if (
      this.isDropdownOpen &&
      dropdown &&
      menuButton &&
      !dropdown.contains(event.target as Node) &&
      !menuButton.contains(event.target as Node)
    ) {
      this.isDropdownOpen = false;
    }
  }

  ngOnInit(): void {
    // initFlowbite();
    this.getProfileDataByUserId();
  }

  constructor(private router: Router, private authService: AuthService) {}

  getProfileDataByUserId() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.name = res.data.firstName;
        this.email = res.data.user?.email;
      },
    });
  }

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

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileId');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('profileUrl');
    localStorage.removeItem('name');
    this.router.navigate(['/auth/login']);
  }
}
