import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { HeroSectionNewLandingComponent } from './components/hero-section-new-landing/hero-section-new-landing.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FeaturesComponent } from '../index/components/features/features.component';

@Component({
  selector: 'app-new-landing-page',
  imports: [
    NavbarComponent,
    HeroSectionNewLandingComponent,
    FooterComponent,
    FeaturesComponent,
  ],
  templateUrl: './new-landing-page.component.html',
  styleUrl: './new-landing-page.component.scss',
})
export class NewLandingPageComponent {}
