import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  hidden: boolean = false;

  constructor(private router: Router) {
    // Listen for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if the current route contains the word 'home' or '/checkout'
        this.hidden =
          event.url.includes('home') || event.url.includes('/checkout');
      });
  }

  redirectToContactUs() {
    this.router.navigate(['/contact-us']);
    // add underline
    window.scrollTo(0, 0);
  }
}
