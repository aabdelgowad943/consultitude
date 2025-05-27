import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Consultant } from '../../../../models/consultant';
import {
  ResponseDepth,
  getResponseDepthValue,
} from '../../../../models/response-depth.enum';

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

  @Input() responseDepthId: string = 'advanced'; // String ID for UI

  // Add this new input to receive the enum value directly
  @Input() responseDepthValue: ResponseDepth = ResponseDepth.Advanced;

  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() startChat = new EventEmitter<any>();

  goToPreviousStep(): void {
    this.previous.emit();
  }

  continueToNextStep() {
    // If responseDepthValue wasn't provided, derive it from the string ID
    const depthValue =
      this.responseDepthValue || getResponseDepthValue(this.responseDepthId);

    const chatData = {
      title: this.fileName || 'New Chat',
      serviceId: this.serviceId,
      ownerId: localStorage.getItem('profileId') || '',
      ask: this.userQuestion,
      agents: this.selectedConsultants.map((c) => c.agentId.toString()),
      documents: [this.documentUrl],
      // responseDepth: depthValue, // Send the enum value
    };
    this.startChat.emit(chatData);
    this.continue.emit();
  }
}
