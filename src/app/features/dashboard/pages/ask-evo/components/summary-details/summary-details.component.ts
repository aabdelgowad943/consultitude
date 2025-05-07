import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Consultant } from '../../../../models/consultant';

@Component({
  selector: 'app-summary-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-details.component.html',
  styleUrl: './summary-details.component.scss',
})
export class SummaryDetailsComponent {
  @Input() fileName: string = '';
  @Input() fileSize: string = '';
  @Input() userQuestion: string = '';
  @Input() serviceId: string = '';
  @Input() documentUrl: string = '';
  @Input() selectedConsultants: any[] = [];

  @Input() responseDepthId: string = 'advanced'; // Add this input

  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() startChat = new EventEmitter<any>();

  goToPreviousStep(): void {
    this.previous.emit();
  }

  continueToNextStep() {
    const chatData = {
      title: this.fileName || 'New Chat',
      serviceId: this.serviceId,
      ownerId: localStorage.getItem('profileId') || '',
      ask: this.userQuestion,
      agents: this.selectedConsultants.map((c) => c.agentId.toString()),
      documents: [this.documentUrl],
      // responseDepth: this.responseDepthId,
    };
    this.startChat.emit(chatData);
    this.continue.emit();
  }
}
