// question-input.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

interface Suggestion {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-question-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-input.component.html',
  styleUrls: ['./question-input.component.scss'],
  animations: [
    trigger('fadeUpStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class QuestionInputComponent {
  @Input() userQuestion: string = '';

  @Output() questionChange = new EventEmitter<string>();
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() keypress = new EventEmitter<KeyboardEvent>();

  // Define suggestion texts
  suggestions: Suggestion[] = [
    {
      text: 'What are the main takeaways?',
      icon: 'images/new/Option Icon2.svg',
    },
    { text: 'Summarize the document', icon: 'images/new/summrize.svg' },
    { text: 'Critique the document', icon: 'images/new/File 2 Icon.svg' },
  ];

  onQuestionChange(value: string) {
    this.userQuestion = value;
    this.questionChange.emit(value);
  }

  onQuestionInputKeypress(event: KeyboardEvent) {
    this.keypress.emit(event);
  }

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.continue.emit();
  }

  // Add a method to apply the suggestion to the input
  applySuggestion(text: string) {
    this.userQuestion = text;
    this.questionChange.emit(text);
    // Optional: automatically continue after selecting a suggestion
    // this.continueToNextStep();
  }
}
