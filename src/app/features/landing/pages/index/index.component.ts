import { Component } from '@angular/core';
import { HeroSectionComponent } from '../index/components/hero-section/hero-section.component';
import { ConsultitudeTemplatesComponent } from './components/consultitude-templates/consultitude-templates.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { gsap } from 'gsap';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ConsultingNeedsComponent } from './components/consulting-needs/consulting-needs.component';
@Component({
  selector: 'app-index',
  imports: [
    HeroSectionComponent,
    ConsultitudeTemplatesComponent,
    FooterComponent,
    FaqsComponent,
    ContactUsComponent,
    ConsultingNeedsComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  constructor() {
    gsap.to('.box', {
      duration: 3,
      rotation: 360,
      scale: 2,
    });
  }
}
