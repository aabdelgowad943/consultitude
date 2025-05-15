import { Component } from '@angular/core';
import { FlexLogoComponent } from '../../../../components/flex-logo/flex-logo.component';
import { SubscribeFormComponent } from '../../../../components/subscribe-form/subscribe-form.component';
import { ThreeCardsComponent } from '../three-cards/three-cards.component';
import { CardComponent } from '../card/card.component';
import { FeaturesComponent } from '../../../index/components/features/features.component';
import { FaqsComponent } from '../../../index/components/faqs/faqs.component';
import { FooterComponent } from '../../../../../../shared/footer/footer.component';

@Component({
  selector: 'app-hero-section-new-landing',
  imports: [
    FlexLogoComponent,
    SubscribeFormComponent,
    ThreeCardsComponent,
    CardComponent,
    FeaturesComponent,
    FaqsComponent,
  ],
  templateUrl: './hero-section-new-landing.component.html',
  styleUrl: './hero-section-new-landing.component.scss',
})
export class HeroSectionNewLandingComponent {
  email: string = '';

  onSubmit() {}

  visible: boolean = false;
  errorMessage: string = '';

  showError(message: string) {
    this.errorMessage = message;
    this.visible = true;
  }
}
