import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-knowledge-hub',
  imports: [AppComponent, RouterOutlet, FooterComponent],
  templateUrl: './knowledge-hub.component.html',
  styleUrl: './knowledge-hub.component.scss',
})
export class KnowledgeHubComponent {}
