import { Component } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';
import { interval, takeWhile } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private alive = true;

  title = 'consultitude';
  constructor(private primeng: PrimeNG, private authService: AuthService) {
    this.primeng.theme.set({
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
        dark: false,
        darkModeSelector: '.my-app-dark',
      },
    });
  }

  ngOnInit() {
    // // Check token expiration every minute
    this.authService.checkTokenAndLogout();
  }

  // ngOnDestroy() {
  //   this.alive = false;
  // }
}
