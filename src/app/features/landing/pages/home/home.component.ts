import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { OverlayImageForBackgroundComponent } from '../../../../shared/overlay-image-for-background/overlay-image-for-background.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    OverlayImageForBackgroundComponent,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
