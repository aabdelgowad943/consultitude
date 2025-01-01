import { Component } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { OverlayImageForBackgroundComponent } from './shared/overlay-image-for-background/overlay-image-for-background.component';
import { FooterComponent } from './shared/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    OverlayImageForBackgroundComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'consultitude';
  constructor(private primeng: PrimeNG) {
    this.primeng.theme.set({
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });
  }
}
