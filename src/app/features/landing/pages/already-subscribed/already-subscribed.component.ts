import { Component } from '@angular/core';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-already-subscribed',
  imports: [LogoComponent, RouterModule],
  templateUrl: './already-subscribed.component.html',
  styleUrl: './already-subscribed.component.scss',
})
export class AlreadySubscribedComponent {}
