import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-knowledge-hub',
  imports: [AppComponent, RouterOutlet],
  templateUrl: './knowledge-hub.component.html',
  styleUrl: './knowledge-hub.component.scss',
})
export class KnowledgeHubComponent {}
