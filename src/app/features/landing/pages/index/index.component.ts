import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
