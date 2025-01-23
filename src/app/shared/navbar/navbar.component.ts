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
