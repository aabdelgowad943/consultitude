import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-consulting-suggestion',
  imports: [],
  templateUrl: './consulting-suggestion.component.html',
  styleUrl: './consulting-suggestion.component.scss',
})
export class ConsultingSuggestionComponent {
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.continue.emit();
  }
}
