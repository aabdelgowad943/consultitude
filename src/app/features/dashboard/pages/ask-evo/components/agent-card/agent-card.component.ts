import { Component, Input } from '@angular/core';
import { Agent } from '../../ask-evo.component';

@Component({
  selector: 'app-agent-card',
  imports: [],
  templateUrl: './agent-card.component.html',
  styleUrl: './agent-card.component.scss',
})
export class AgentCardComponent {
  @Input() agent!: Agent;
}
