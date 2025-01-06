import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-error-message-dialog',
  imports: [ButtonModule, Dialog],
  templateUrl: './error-message-dialog.component.html',
  styleUrl: './error-message-dialog.component.scss',
})
export class ErrorMessageDialogComponent {
  @Input() visible: boolean = false;
  @Input() errorMessage: string = '';
  @Output() close = new EventEmitter<void>();

  hideDialog() {
    this.close.emit();
  }
}
