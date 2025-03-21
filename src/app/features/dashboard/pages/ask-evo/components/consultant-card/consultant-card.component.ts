import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-consultant-card',
  imports: [],
  templateUrl: './consultant-card.component.html',
  styleUrl: './consultant-card.component.scss',
})
export class ConsultantCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() managerInitial!: string;
  @Input() managerName!: string;
  @Input() commentsCount!: number;
}
