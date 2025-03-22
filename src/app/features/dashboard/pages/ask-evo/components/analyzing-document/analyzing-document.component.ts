// analyzing-document.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analyzing-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyzing-document.component.html',
  styleUrls: ['./analyzing-document.component.scss'],
})
export class AnalyzingDocumentComponent {
  @Input() isAnalyzing = false;
  @Input() analysisComplete = false;
}
