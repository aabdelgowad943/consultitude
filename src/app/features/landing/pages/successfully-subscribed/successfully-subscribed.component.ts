import { Component } from '@angular/core';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-successfully-subscribed',
  imports: [LogoComponent, RouterModule],
  templateUrl: './successfully-subscribed.component.html',
  styleUrl: './successfully-subscribed.component.scss',
})
export class SuccessfullySubscribedComponent {}
