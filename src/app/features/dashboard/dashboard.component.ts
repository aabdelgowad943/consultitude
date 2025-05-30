import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, FormsModule, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  userId: string = localStorage.getItem('userId')!;
  name: string = '';
  email: string = '';
  profileImage: string = '';
  isDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getProfileDataByUserId();
  }

  getProfileDataByUserId() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.name = res.data.firstName;
        this.email = res.data.user?.email;
        this.profileImage = res.data.profileUrl;
      },
    });
  }

  menuVisible: boolean = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  logout() {
    this.authService.logout();
  }

  navigateToRequestDocument() {
    this.router.navigate(['/index'], { fragment: 'request-document' });

    // Add manual scroll after a small delay
    setTimeout(() => {
      const element = document.getElementById('request-document');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

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
}
