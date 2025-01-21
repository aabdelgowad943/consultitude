import { Component } from '@angular/core';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { RouterLink, RouterModule } from '@angular/router';
import { OverlayImageForBackgroundComponent } from '../../../../shared/overlay-image-for-background/overlay-image-for-background.component';

@Component({
  selector: 'app-successfully-subscribed',
  imports: [LogoComponent, RouterModule, OverlayImageForBackgroundComponent],
  templateUrl: './successfully-subscribed.component.html',
  styleUrl: './successfully-subscribed.component.scss',
})
export class SuccessfullySubscribedComponent {}
