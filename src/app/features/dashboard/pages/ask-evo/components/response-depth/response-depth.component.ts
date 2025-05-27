import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  getResponseDepthValue,
  ResponseDepth,
} from '../../../../models/response-depth.enum';

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
  @Output() depthValueSelected = new EventEmitter<ResponseDepth>();
  @Input() selectedDepthId: string = 'basic';

  selectDepth(depthId: string): void {
    this.selectedDepthId = depthId;
    this.depthSelected.emit(depthId);

    // Also emit the enum value
    const depthValue = getResponseDepthValue(depthId);
    this.depthValueSelected.emit(depthValue);
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
