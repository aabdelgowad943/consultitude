import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ResponseDepthOption {
  id: string;
  title: string;
  description: string;
  credits: number;
  timeEstimate: string;
  icon: string;
}

@Component({
  selector: 'app-response-depth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-depth.component.html',
  styleUrl: './response-depth.component.scss',
})
export class ResponseDepthComponent {
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() depthSelected = new EventEmitter<string>();
  @Input() selectedDepthId: string = 'advanced'; // Default to 'advanced'

  depthOptions: ResponseDepthOption[] = [
    {
      id: 'basic-id',
      title: 'Basic',
      description: 'Quick, high-level advice. Great for initial direction.',
      credits: 10,
      timeEstimate: '~30 seconds',
      icon: 'images/new/basic-icon.svg',
    },
    {
      id: 'advanced-id',
      title: 'Advanced',
      description:
        'In-depth analysis with examples and strategic recommendations.',
      credits: 25,
      timeEstimate: '~1-2 minutes',
      icon: 'images/new/advanced-icon.svg',
    },
    {
      id: 'expert-id',
      title: 'Expert',
      description:
        'Consultant-grade deep-dive with frameworks, models, and insights.',
      credits: 50,
      timeEstimate: '~3-5 minutes',
      icon: 'images/new/expert-icon.svg',
    },
  ];

  selectDepth(depthId: string): void {
    this.selectedDepthId = depthId;
    this.depthSelected.emit(depthId);
  }

  goToPreviousStep(): void {
    this.previous.emit();
  }

  continueToNextStep(): void {
    this.continue.emit();
  }

  // Handle Enter key press
  onKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.continueToNextStep();
    }
  }
}
