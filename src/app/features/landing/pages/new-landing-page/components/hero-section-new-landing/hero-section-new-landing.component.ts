import { Component } from '@angular/core';
import { FlexLogoComponent } from '../../../../components/flex-logo/flex-logo.component';
import { SubscribeFormComponent } from '../../../../components/subscribe-form/subscribe-form.component';

@Component({
  selector: 'app-hero-section-new-landing',
  imports: [FlexLogoComponent, SubscribeFormComponent],
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
