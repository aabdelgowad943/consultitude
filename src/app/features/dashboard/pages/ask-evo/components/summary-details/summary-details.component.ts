import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Consultant {
  id: number;
  type: string;
  description: string;
  creator: {
    name: string;
    avatar: string | null;
    initial?: string;
  };
  likes: number;
  icon: string;
  selected?: boolean;
}

@Component({
  selector: 'app-summary-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-details.component.html',
  styleUrl: './summary-details.component.scss',
})
export class SummaryDetailsComponent {
  @Input() fileName: string = '';
  @Input() fileSize: string = '';
  @Input() userQuestion: string = '';
  @Input() selectedConsultants: Consultant[] = [];

  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.continue.emit();
  }
}
