import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class SummaryDetailsComponent implements OnInit {
  @Input() fileName: string = '';
  @Input() fileSize: string = '';
  @Input() userQuestion: string = '';
  @Input() serviceId: string = '';
  @Input() selectedConsultants: Consultant[] = [];

  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  ngOnInit(): void {
    console.log(this.userQuestion);
    console.log(this.serviceId);
    console.log(this.selectedConsultants);
  }

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.continue.emit();
  }
}
