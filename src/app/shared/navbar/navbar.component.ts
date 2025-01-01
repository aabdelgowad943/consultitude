import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [LogoComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}
