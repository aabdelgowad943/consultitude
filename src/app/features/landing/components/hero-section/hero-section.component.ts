import { Component } from '@angular/core';
import { FlexLogoComponent } from '../flex-logo/flex-logo.component';
import { SubscribeFormComponent } from '../subscribe-form/subscribe-form.component';
import { LogoComponent } from '../../../../shared/logo/logo.component';

@Component({
  selector: 'app-hero-section',
  imports: [FlexLogoComponent, SubscribeFormComponent, LogoComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {}
