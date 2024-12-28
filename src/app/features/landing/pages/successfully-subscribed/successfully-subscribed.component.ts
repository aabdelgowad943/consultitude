import { Component } from '@angular/core';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-successfully-subscribed',
  imports: [LogoComponent, RouterLink],
  templateUrl: './successfully-subscribed.component.html',
  styleUrl: './successfully-subscribed.component.scss',
})
export class SuccessfullySubscribedComponent {}
