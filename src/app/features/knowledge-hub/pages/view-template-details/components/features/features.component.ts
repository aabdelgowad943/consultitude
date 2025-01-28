import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
})
export class FeaturesComponent {
  @Input() features!: string[];
  @Output() download = new EventEmitter<void>();

  onDownload() {
    this.download.emit();
  }
}
