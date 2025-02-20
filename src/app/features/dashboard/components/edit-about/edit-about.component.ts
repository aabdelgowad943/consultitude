import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-edit-about',
  imports: [DialogModule, FormsModule, ButtonModule],
  templateUrl: './edit-about.component.html',
  styleUrl: './edit-about.component.scss',
})
export class EditAboutComponent {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() about: string = '';
  @Output() saveChangesEvent: EventEmitter<string> = new EventEmitter();

  closeDialog() {
    this.display = false;
    this.displayChange.emit(this.display);
  }

  saveChanges() {
    this.saveChangesEvent.emit(this.about);
    this.closeDialog();
  }
}
