import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  @Input() title: string = 'No Conversations Yet';
  @Input() message: string =
    'When you start chatting with our AI Consultant, your conversations will appear here.';
  @Input() iconSize: number = 48;
  @Input() showDivider: boolean = true;
}
