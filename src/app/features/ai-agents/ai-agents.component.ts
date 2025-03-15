import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-ai-agents',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './ai-agents.component.html',
  styleUrl: './ai-agents.component.scss',
})
export class AiAgentsComponent implements OnInit {
  userId: string = localStorage.getItem('userId')!;
  name: string = '';
  email: string = '';
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
      },
    });
  }

  menuVisible: boolean = false;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const dropdown = document.getElementById('dashboard-dropdown');
    const menuButton = document.getElementById('dashboard-menu-button');

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

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  logout() {
    // Clear the token and user id from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileId');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('profileUrl');
    localStorage.removeItem('name');

    // Optionally, you can navigate the user to the login page or home page after logout
    this.router.navigate(['/auth/login']);
  }
}
