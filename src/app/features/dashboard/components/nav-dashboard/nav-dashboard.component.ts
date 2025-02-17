import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-dashboard',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-dashboard.component.html',
  styleUrl: './nav-dashboard.component.scss',
})
export class NavDashboardComponent {
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
}
