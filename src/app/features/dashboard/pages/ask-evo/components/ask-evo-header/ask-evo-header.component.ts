import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { RapidResponseDialogComponent } from '../../../../components/rapid-response-dialog/rapid-response-dialog.component';

@Component({
  selector: 'app-ask-evo-header',
  imports: [HistoryComponent, CommonModule],
  templateUrl: './ask-evo-header.component.html',
  styleUrl: './ask-evo-header.component.scss',
})
export class AskEvoHeaderComponent {
  @Input() agents: any[] = [];
  @Input() conversations: any[] = [];
  @Output() showDocumentUploadStepper = new EventEmitter<boolean>();

  constructor(private dialogService: DialogService) {}

  openRapidResponseDialog() {
    const dialogRef = this.dialogService.open(RapidResponseDialogComponent, {
      header: '',
      width: '600px',
      contentStyle: {
        'border-radius': '20px',
        padding: '0px',
        'overflow-y': 'auto',
        'scrollbar-width': 'none',
        '-ms-overflow-style': 'none',
      },
      showHeader: false,
    });

    dialogRef.onClose.subscribe((result) => {
      if (result && result.showStepper) {
        // Emit an event to parent component to show stepper
        this.showDocumentUploadStepper.emit(true);
      }
    });
  }
}
