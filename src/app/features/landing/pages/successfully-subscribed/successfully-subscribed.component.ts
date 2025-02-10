import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayImageForBackgroundComponent } from '../../../../shared/overlay-image-for-background/overlay-image-for-background.component';

@Component({
  selector: 'app-successfully-subscribed',
  imports: [RouterModule, OverlayImageForBackgroundComponent],
  templateUrl: './successfully-subscribed.component.html',
  styleUrl: './successfully-subscribed.component.scss',
})
export class SuccessfullySubscribedComponent {}
