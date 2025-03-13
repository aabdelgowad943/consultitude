import { Component } from '@angular/core';
import { OverlayImageForBackgroundComponent } from '../../../../shared/overlay-image-for-background/overlay-image-for-background.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { HeroAboutSectionComponent } from './components/hero-about-section/hero-about-section.component';
import { MissionAspirationComponent } from './components/mission-aspiration/mission-aspiration.component';
import { ValuesGridComponentComponent } from './components/values-grid-component/values-grid-component.component';
import { FooterCardComponent } from './components/footer-card/footer-card.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';

@Component({
  selector: 'app-about-us',
  imports: [
    OverlayImageForBackgroundComponent,
    NavbarComponent,
    HeroAboutSectionComponent,
    MissionAspirationComponent,
    ValuesGridComponentComponent,
    FooterCardComponent,
    FooterComponent,
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {}
