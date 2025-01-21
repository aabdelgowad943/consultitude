import { Component } from '@angular/core';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { RouterModule } from '@angular/router';
import { OverlayImageForBackgroundComponent } from '../../../../shared/overlay-image-for-background/overlay-image-for-background.component';

@Component({
  selector: 'app-already-subscribed',
  imports: [LogoComponent, RouterModule, OverlayImageForBackgroundComponent],
  templateUrl: './already-subscribed.component.html',
  styleUrl: './already-subscribed.component.scss',
})
export class AlreadySubscribedComponent {}
