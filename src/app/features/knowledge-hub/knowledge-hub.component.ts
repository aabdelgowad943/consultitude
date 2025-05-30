import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-knowledge-hub',
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './knowledge-hub.component.html',
  styleUrl: './knowledge-hub.component.scss',
})
export class KnowledgeHubComponent {}
