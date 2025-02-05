import { Component } from '@angular/core';
import { HeroSectionComponent } from '../index/components/hero-section/hero-section.component';
import { ConsultitudeTemplatesComponent } from './components/consultitude-templates/consultitude-templates.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ConsultingNeedsComponent } from './components/consulting-needs/consulting-needs.component';
import { AnimationCardsComponent } from './components/animation-cards/animation-cards.component';
import { PartnersComponent } from './components/partners/partners.component';
import { EffortlessComponent } from './components/effortless/effortless.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
@Component({
  selector: 'app-index',
  imports: [
    HeroSectionComponent,
    ConsultitudeTemplatesComponent,
    FooterComponent,
    FaqsComponent,
    ContactUsComponent,
    ConsultingNeedsComponent,
    AnimationCardsComponent,
    PartnersComponent,
    EffortlessComponent,
    NavbarComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {}
